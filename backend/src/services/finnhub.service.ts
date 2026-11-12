import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FinnhubExchangeLookupDto,
  FinnhubPriceLookupDto,
  FinnhubSymbolLookupDto,
} from '../dto/finnhub.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as process from 'process';
import { AxiosError } from 'axios';

@Injectable()
export class FinnhubService {
  constructor(private readonly httpService: HttpService) {}

  // method to retrieve basic information on a stock from Finnhub API
  async symbolLookup(dto: FinnhubSymbolLookupDto) {
    // make HTTP request to Finnhub API
    const { data } = await firstValueFrom(
      this.httpService.get('https://finnhub.io/api/v1/search', {
        params: {
          q: dto.stock_symbol,
          token: process.env.FINNHUB_API_KEY,
        },
      }),
    );

    // the search returns multiple ticker matches (e.g. searching ACA gives: ACA, ACAA, ACAD) so we find the exact ticker
    const stockData = data.result.find(
      (item) => item.symbol === dto.stock_symbol,
    );

    //console.log(stockData);

    if (!stockData) {
      throw new NotFoundException(`${dto.stock_symbol} not found`);
    }

    return {
      description: stockData.description,
      stock_symbol: stockData.symbol,
      type: stockData.type,
    };
  }

  // method to retrieve the price of a stock from Finnhub API
  async getPrice(dto: FinnhubPriceLookupDto) {
    const { data } = await firstValueFrom(
      this.httpService.get('https://finnhub.io/api/v1/quote', {
        params: {
          symbol: dto.stock_symbol,
          token: process.env.FINNHUB_API_KEY,
        },
      }),
    );

    if (!data || data.c == null || data.c == 0) {
      throw new NotFoundException(`${dto.stock_symbol} price data not found`);
    }

    return {
      current: data.c,
      change: data.d,
      percent_change: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previous_close: data.pc,
    };
  }

  // method to retrieve the price of a stock from Finnhub API (only if the corresponding exchange is open)
  async getPriceIfOpen(dto: FinnhubPriceLookupDto) {
    console.log(dto.stock_symbol);

    const company = await this.companyProfile({
      stock_symbol: dto.stock_symbol,
    });

    console.log(company);
    console.log(company.country);

    const exchange = await this.marketStatus({
      exchange: company.country,
    });

    console.log(exchange);

    if (!exchange.isOpen) {
      throw new BadRequestException(
        `${dto.stock_symbol} cannot be purchased as the ${company.exchange} exchange is currently closed.`,
      );
    }

    return this.getPrice({ stock_symbol: dto.stock_symbol });
  }

  // method to retrieve company profile from Finnhub API
  async companyProfile(dto: FinnhubSymbolLookupDto) {
    try {
      // make HTTP request to Finnhub API
      const { data } = await firstValueFrom(
        this.httpService.get('https://finnhub.io/api/v1/stock/profile2', {
          params: {
            symbol: dto.stock_symbol,
            token: process.env.FINNHUB_API_KEY,
          },
        }),
      );

      if (!data || data.country == null) {
        throw new NotFoundException(`${dto.stock_symbol} not found`);
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
            `Access to company data for ${dto.stock_symbol} is restricted by Finnhub`,
          );
        }
      }

      throw error;
    }
  }

  // method to retrieve market status of a given exchange from Finnhub API
  async marketStatus(dto: FinnhubExchangeLookupDto) {
    try {
      // make HTTP request to Finnhub API
      const { data } = await firstValueFrom(
        this.httpService.get('https://finnhub.io/api/v1/stock/market-status', {
          params: {
            exchange: dto.exchange,
            token: process.env.FINNHUB_API_KEY,
          },
        }),
      );

      if (!data || data.exchange == null) {
        throw new NotFoundException(`${dto.exchange} not found`);
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
            `Access to market data for ${dto.exchange} is restricted by Finnhub`,
          );
        }
      }

      throw error;
    }
  }
}
