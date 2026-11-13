import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FinnhubExchangeLookupDto,
  FinnhubPriceLookupDto,
  FinnhubPriceResponseDto,
  FinnhubSymbolLookupDto,
} from '../dto/finnhub.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as process from 'process';
import { AxiosError } from 'axios';
import { CacheService } from './cache.service';

@Injectable()
export class FinnhubService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {}

  // method to retrieve basic information on a stock from Finnhub API
  async symbolLookup(dto: FinnhubSymbolLookupDto) {
    const symbol = dto.stock_symbol.trim().toUpperCase();
    return this.cacheService.getOrSet(
      `finnhub:symbol:${symbol}`,
      300_000,
      async () => {
        const { data } = await firstValueFrom(
          this.httpService.get('https://finnhub.io/api/v1/search', {
            params: { q: symbol, token: process.env.FINNHUB_API_KEY },
          }),
        );

        const stockData = data.result.find((item) => item.symbol === symbol);
        if (!stockData) throw new NotFoundException(`${symbol} not found`);

        return {
          description: stockData.description,
          stock_symbol: stockData.symbol,
          type: stockData.type,
        };
      },
    );
  }

  // method to retrieve the price of a stock (from Finnhub API - does not check the cache)
  // used to get the most up-to-date price e.g. for trades
  // gets price from Finnhub API then updates cache
  async getLatestPrice(
    dto: FinnhubSymbolLookupDto,
  ): Promise<FinnhubPriceResponseDto> {
    const symbol = dto.stock_symbol.trim().toUpperCase();
    const { data } = await firstValueFrom(
      this.httpService.get('https://finnhub.io/api/v1/quote', {
        params: { symbol, token: process.env.FINNHUB_API_KEY },
      }),
    );

    if (!data || data.c == null || data.c == 0) {
      throw new NotFoundException(`${symbol} price data not found`);
    }

    const price: FinnhubPriceResponseDto = {
      current: data.c,
      change: data.d,
      percent_change: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previous_close: data.pc,
    };

    await this.cacheService.set(`finnhub:price:${symbol}`, 60_000, price);
    return price;
  }

  // method to retrieve the price of a stock (from cache - in the case of a cache miss it will retrieve from Finnhub API)
  async getCachedPrice(
    dto: FinnhubPriceLookupDto,
  ): Promise<FinnhubPriceResponseDto> {
    const symbol = dto.stock_symbol.trim().toUpperCase();
    const cached = await this.cacheService.get<FinnhubPriceResponseDto>(
      `finnhub:price:${symbol}`,
    );

    if (cached !== undefined) {
      return cached;
    } else {
      return await this.getLatestPrice({ stock_symbol: symbol });

    }
  }

  // method to retrieve the price of a stock from Finnhub API (only if the corresponding exchange is open)
  // used when making a trade
  async getPriceIfOpen(dto: FinnhubPriceLookupDto) {
    //console.log(dto.stock_symbol);

    const company = await this.companyProfile({
      stock_symbol: dto.stock_symbol,
    });

    //console.log(company);
    //console.log(company.country);

    const exchange = await this.marketStatus({
      exchange: company.country,
    });

    //console.log(exchange);

    if (!exchange.isOpen) {
      throw new BadRequestException(
        `${dto.stock_symbol} cannot be purchased as the ${company.exchange} exchange is currently closed.`,
      );
    }

    // get the latest price as we want up-to-date stock price when making a trade
    return this.getLatestPrice({ stock_symbol: dto.stock_symbol });
  }

  // method to retrieve company profile from Finnhub API
  async companyProfile(dto: FinnhubSymbolLookupDto) {
    const symbol = dto.stock_symbol.trim().toUpperCase();
    return this.cacheService.getOrSet(
      `finnhub:company-profile:${symbol}`,
      300_000,
      async () => {
        try {
          // make HTTP request to Finnhub API
          const { data } = await firstValueFrom(
            this.httpService.get('https://finnhub.io/api/v1/stock/profile2', {
              params: {
                symbol,
                token: process.env.FINNHUB_API_KEY,
              },
            }),
          );

          if (!data || data.country == null) {
            throw new NotFoundException(`${symbol} not found`);
          }

          return {
            country: data.country,
            currency: data.currency,
            exchange: data.exchange,
            ipo: data.ipo,
            marketCapitalization: data.marketCapitalization,
            name: data.name,
            phone: data.phone,
            shareOutstanding: data.shareOutstanding,
            ticker: data.ticker,
            weburl: data.weburl,
            logo: data.logo,
            finnhubIndustry: data.finnhubIndustry,
          };
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 403) {
              throw new ForbiddenException(
                `Access to company data for ${symbol} is restricted by Finnhub`,
              );
            }
          }

          throw error;
        }
      },
    );
  }

  // method to retrieve market status of a given exchange from Finnhub API
  async marketStatus(dto: FinnhubExchangeLookupDto) {
    const exchange = dto.exchange.trim().toUpperCase();
    return this.cacheService.getOrSet(
      `finnhub:market-status:${exchange}`,
      60_000,
      async () => {
        try {
          // make HTTP request to Finnhub API
          const { data } = await firstValueFrom(
            this.httpService.get(
              'https://finnhub.io/api/v1/stock/market-status',
              {
                params: {
                  exchange,
                  token: process.env.FINNHUB_API_KEY,
                },
              },
            ),
          );

          if (!data || data.exchange == null) {
            throw new NotFoundException(`${exchange} not found`);
          }

          return {
            exchange: data.exchange,
            holiday: data.holiday,
            isOpen: data.isOpen,
            session: data.session,
            timezone: data.timezone,
            t: data.t,
          };
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 403) {
              throw new ForbiddenException(
                `Access to market data for ${exchange} is restricted by Finnhub`,
              );
            }
          }

          throw error;
        }
      },
    );
  }
}
