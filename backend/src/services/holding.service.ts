import { PrismaService } from './prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FinnhubPriceChangeDataItemDto } from '../dto/finnhub.dto';
import { StockPriceService } from './stockprice.service';

@Injectable()
export class HoldingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stockPriceService: StockPriceService,
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

  // method to get today's price changes by iterating through each of the user's holdings and making requests to Finnhub's API
  async getHoldingsPriceChanges(userId: number) {
    // get the user's holdings
    const holdings = await this.prisma.holding.findMany({
      where: {
        user_id: userId,
      },
    });

    const priceChanges = [] as FinnhubPriceChangeDataItemDto[];

    // for each holding, we get the daily price change and add it to the array, priceChanges
    for (const holding of holdings) {
      const response = await this.stockPriceService.getPrice({
        stock_symbol: holding.stock_symbol,
        type: 'change',
      });

      const priceChange = response.price;

      priceChanges.push({
        stock_symbol: holding.stock_symbol,
        price_change: priceChange,
      });
    }

    return {
      data: priceChanges,
    };
  }
}
