import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FinnhubPriceChangeDataItemDto } from '../dto/finnhub.dto';
import { BuyHoldingDto, SellHoldingDto } from '../dto/trade.dto';
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

    if (data) {
      return {
        data: data,
      };
    } else {
      return {
        message: 'No holdings found',
      };
    }
  }

  // method to update/add a holding that has been purchased
  async buy(tx: Prisma.TransactionClient, userId: number, dto: BuyHoldingDto) {
    return tx.holding.upsert({
      where: {
        user_id_stock_symbol: {
          stock_symbol: dto.stock_symbol,
          user_id: userId,
        },
      },
      update: {
        quantity: {
          increment: dto.quantity,
        },
      },
      create: {
        stock_symbol: dto.stock_symbol,
        quantity: dto.quantity,
        user_id: userId,
      },
    });
  }

  // update to sell/remove a holding that has been sold
  async sell(
    tx: Prisma.TransactionClient,
    userId: number,
    dto: SellHoldingDto,
  ) {
    const holding = await tx.holding.update({
      where: {
        user_id_stock_symbol: {
          user_id: userId,
          stock_symbol: dto.stock_symbol,
        },
      },
      data: {
        quantity: {
          decrement: dto.quantity,
        },
      },
    });

    // if the holding now has a quantity of 0, then we can remove it from the database
    if (holding.quantity.toNumber() <= 0) {
      return tx.holding.delete({
        // todo probably a better way to do this since we have holding (???)
        where: {
          user_id_stock_symbol: {
            user_id: userId,
            stock_symbol: dto.stock_symbol,
          },
        },
      });
    }

    return holding;
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
      const priceChange = await this.stockPriceService.getPrice({
        stock_symbol: holding.stock_symbol,
        type: 'change',
      });

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
