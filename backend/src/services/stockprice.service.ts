import { Inject, Injectable } from '@nestjs/common';
import { FinnhubService } from './finnhub.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  FinnhubPriceLookupDto,
  FinnhubPriceResponseDto,
} from '../dto/finnhub.dto';

@Injectable()
export class StockPriceService {
  private readonly cacheTtl = 60_000; // 1 min ttl for now, 15-30 seconds would probably be ideal

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache, // inject the cache-manager, see https://docs.nestjs.com/data/caching
    private readonly finnhubService: FinnhubService,
  ) {}

  // method to get a stock's price
  async getPrice(dto: FinnhubPriceLookupDto): Promise<FinnhubPriceResponseDto> {
    // first we attempt to retrieve the prices from the cache
    const cacheKey = `stock-price:${dto.stock_symbol}`;

    const cachedPrices =
      await this.cacheManager.get<FinnhubPriceResponseDto>(cacheKey);

    // return cachedPrice on cache hit
    if (cachedPrices !== null && cachedPrices !== undefined) {
      // console.log(
      //   `Cache hit on ${dto.stock_symbol}'s price`,
      // );
      return cachedPrices;
    }

    // console.log(
    //   `Cache miss on ${dto.stock_symbol}'s prices, getting updated prices`,
    // );

    // retrieve and store price in cache, from Finnhub API, on cache miss
    const prices = await this.finnhubService.getPrice({
      stock_symbol: dto.stock_symbol,
    });

    await this.cacheManager.set(cacheKey, prices, this.cacheTtl); // 1 min ttl for now, 15-30 seconds would probably be ideal

    return prices;
  }

  // method to update cached values
  async updateCache(stock_symbol: string, prices: FinnhubPriceResponseDto) {
    const cacheKey = `stock-price:${stock_symbol}`;

    await this.cacheManager.set(cacheKey, prices, this.cacheTtl);
  }
}
