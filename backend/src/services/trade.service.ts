import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Trade } from '@prisma/client';
import { FinnhubService } from './finnhub.service';
import { GainsDto, HistoryLookupDto, TradeHolding } from '../dto/trade.dto';
import { StockPriceService } from './stockprice.service';

@Injectable()
export class TradeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly finnhubService: FinnhubService,
    private readonly stockPriceService: StockPriceService,
  ) {}

  // method to record a trade in the database
  async recordTrade(
    tx: Prisma.TransactionClient,
    userId: number,
    dto: TradeHolding,
    type: string,
  ) {
    // retrieve price from Finnhub API to get the latest price
    const price = (
      await this.finnhubService.getPrice({
        stock_symbol: dto.stock_symbol,
        type: 'current',
      })
    ).price;

    if (price === 0) {
      throw new Error(
        `Could not retrieve a valid price for ${dto.stock_symbol}`,
      );
    }

    // update stock's cached value with updated value while we already have the latest price
    await this.stockPriceService.updateCache(
      dto.stock_symbol,
      'current',
      price,
    );

    return tx.trade.create({
      data: {
        stock_symbol: dto.stock_symbol,
        quantity: dto.quantity,
        price: price,
        type: type,
        user_id: userId,
      },
    });
  }

  // method to calculate the user's unrealised and realised gains
  async getGains(userId: number) {
    // get the user's trades chronologically, this is important as every buy changes the cost basis of future sells
    const trades = await this.prisma.trade.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    const groupedTrades = new Map<string, Trade[]>();

    // group trades by stock symbols todo maybe a way to do this in the prisma method call above, some group by attribute
    for (const trade of trades) {
      const group = groupedTrades.get(trade.stock_symbol);

      if (group) {
        group.push(trade);
      } else {
        groupedTrades.set(trade.stock_symbol, [trade]);
      }
    }

    //console.log(groupedTrades);

    let gains: GainsDto;
    let totalRealisedGains = 0;
    let totalUnrealisedGains = 0;

    // for each stock the user has traded, calculate the gains for that stock
    for (const stockTrades of groupedTrades.values()) {
      gains = await this.calculateGains(stockTrades);
      totalRealisedGains += gains.realised_gains;
      totalUnrealisedGains += gains.unrealised_gains;
    }

    // return total unrealised and realised gains
    return {
      realised_gains: totalRealisedGains,
      unrealised_gains: totalUnrealisedGains,
    };
  }

  // method to calculate realised gains for each stock using an average cost basis system
  async calculateGains(trades: Trade[]): Promise<GainsDto> {
    let quantity = 0;
    let averagePrice = 0;
    let realisedGain = 0;
    let unrealisedGain = 0;

    // get the stock ticker that we are calculating gains for so we can search up it's current price later, allowing us to calculate unrealised gains
    const stockSymbol = trades[0].stock_symbol;

    for (const trade of trades) {
      if (trade.type === 'buy') {
        if (quantity !== 0) {
          // if the quantity is greater than zero then we update the average price
          averagePrice =
            (quantity * averagePrice +
              trade.quantity.toNumber() * trade.price.toNumber()) /
            (quantity + trade.quantity.toNumber());
          quantity += trade.quantity.toNumber();
        } else {
          // if the quantity is not greater than zero (equal to zero) then we set the average price
          averagePrice = trade.price.toNumber();
          quantity = trade.quantity.toNumber();
        }
      } else {
        // if we are not buying then we are selling, so we decrement the quantity and add up the realised gain
        realisedGain +=
          (trade.price.toNumber() - averagePrice) * trade.quantity.toNumber();
        quantity -= trade.quantity.toNumber();
      }
    }

    // if the user still owns a stock, then we calculate the unrealised gain
    if (quantity > 0) {
      const response = await this.stockPriceService.getPrice({
        stock_symbol: stockSymbol,
        type: 'current',
      });

      const currPrice = response.price;

      unrealisedGain = quantity * (currPrice - averagePrice);
      //console.log('stock: ' + stockSymbol);
      //console.log('quantity: ' + quantity);
      //console.log('unrealised gain: ' + unrealisedGain);
    }

    return {
      realised_gains: realisedGain,
      unrealised_gains: unrealisedGain,
    };
  }

  // method to get the user's history of trades from the database
  async getHistory(userId: number, dto: HistoryLookupDto) {
    const where: Prisma.TradeWhereInput = {
      user_id: userId,
    };

    if (dto.stock_symbol !== undefined) {
      where.stock_symbol = dto.stock_symbol;
    }

    if (dto.quantity_from !== undefined || dto.quantity_to !== undefined) {
      where.quantity = {
        ...(dto.quantity_from !== undefined && {
          gte: dto.quantity_from,
        }),
        ...(dto.quantity_to !== undefined && {
          lte: dto.quantity_to,
        }),
      };
    }

    if (dto.price_from !== undefined || dto.price_to !== undefined) {
      where.price = {
        ...(dto.price_from !== undefined && {
          gte: dto.price_from,
        }),
        ...(dto.price_to !== undefined && {
          lte: dto.price_to,
        }),
      };
    }

    if (dto.type !== undefined) {
      where.type = dto.type;
    }

    if (dto.date_from !== undefined || dto.date_to !== undefined) {
      where.created_at = {
        ...(dto.date_from !== undefined && {
          gte: new Date(dto.date_from),
        }),
        ...(dto.date_to !== undefined && {
          lte: new Date(dto.date_to),
        }),
      };
    }

    const data = await this.prisma.trade.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
    });

    return {
      data: data.map((trade) => ({
        id: trade.id,
        user_id: trade.user_id,
        stock_symbol: trade.stock_symbol,
        quantity: trade.quantity,
        price: trade.price,
        type: trade.type,
        total_value: trade.price.mul(trade.quantity),
        created_at: trade.created_at.toISOString(),
      })),
    };
  }
}
