import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getOrSet<T>(
    key: string,
    ttl: number,
    load: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.cacheManager.get<T>(key);
    if (cached !== undefined) {
      //console.log(`cache hit on ${key}`);
      return cached;
    }

    const value = await load();
    await this.cacheManager.set(key, value, ttl);
    //console.log(`cache miss on ${key}`);

    return value;
  }

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, ttl: number, value: T): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }
}
