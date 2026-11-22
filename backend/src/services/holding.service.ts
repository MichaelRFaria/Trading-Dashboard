import { PrismaService } from './prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FinnhubService } from './finnhub.service';

@Injectable()
export class HoldingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly finnhubService: FinnhubService,
  ) {}

  // method to retrieve all the user's holdings from the database
  async getHoldings(userId: number) {
    const data = await this.prisma.holding.findMany({
      where: {
        user_id: userId,
      },
    });

    if (data.length === 0) {
      throw new NotFoundException(`No holdings found`);
    }

    return {
      data: data,
    };
  }

  // method for retrieving prices for all holdings a user owns
  async getHoldingsPrices(userId: number) {
    const holdings = await this.getHoldings(userId);

    const prices = await Promise.all(
      holdings.data.map(async (item) => {
        const priceData = await this.finnhubService.getCachedPrice({
          stock_symbol: item.stock_symbol,
        });

        return [item.stock_symbol, priceData] as const;
      }),
    );

    return {
      data: Object.fromEntries(prices),
    };
  }
}
