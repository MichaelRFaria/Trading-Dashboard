import { Inject, Injectable } from '@nestjs/common';
import { FinnhubService } from './finnhub.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { FinnhubPriceLookupDto } from '../dto/finnhub.dto';

@Injectable()
export class StockPriceService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // https://docs.nestjs.com/data/caching
    private readonly finnhubService: FinnhubService,
  ) {}

  async getPrice(dto: FinnhubPriceLookupDto): Promise<number> {
    const cacheKey = `stock-price:${dto.stock_symbol}-${dto.type}`;

    const cachedPrice = await this.cacheManager.get<number>(cacheKey);

    if (cachedPrice !== undefined && cachedPrice !== null) {
      console.log(`Cache hit on ${dto.stock_symbol}'s ${dto.type} price`);
      return cachedPrice;
    }

    console.log(
      `Cache miss on ${dto.stock_symbol}'s ${dto.type} price, getting updated price`,
    );

    const price = await this.finnhubService.getPrice({
      stock_symbol: dto.stock_symbol,
      type: dto.type,
    });

    await this.cacheManager.set(cacheKey, price, 60000); // 1 min ttl for now, 15-30 seconds would probably be ideal

    return price.price;
  }

  async updateCache(
    stock_symbol: string,
    type: 'current' | 'change',
    price: number,
  ) {
    const cacheKey = `stock-price:${stock_symbol}-${type}`;

    await this.cacheManager.set(cacheKey, price, 60000); // 1 min ttl for now, 15-30 seconds would probably be ideal
  }
}
