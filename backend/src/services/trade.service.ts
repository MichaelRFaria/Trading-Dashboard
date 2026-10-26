import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Trade } from '@prisma/client';
import {
  BuyHoldingDto,
  GainsDto,
  HistoryLookupDto,
  SellHoldingDto,
  TradeHolding,
} from '../dto/trade.dto';
import { StockPriceService } from './stockprice.service';

@Injectable()
export class TradeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stockPriceService: StockPriceService,
  ) {}

  // method to update/add a holding that has been purchased
  async buy(
    tx: Prisma.TransactionClient,
    userId: number,
    price: number,
    dto: BuyHoldingDto,
  ) {
    const account = await tx.account.findFirst({
      where: {
        user_id: userId,
        selected: true,
      },
    });

    const totalPurchasePrice = new Prisma.Decimal(price).mul(dto.quantity);

    if (!account) {
      throw new NotFoundException(`No accounts found`);
    }

    const result = await tx.account.updateMany({
      where: {
        id: account.id,
        balance: {
          gte: totalPurchasePrice,
        },
      },
      data: {
        balance: {
          decrement: totalPurchasePrice,
        },
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        `Insufficient funds to purchase. Your balance is $${account.balance.toString()}, and the total purchase price was $${totalPurchasePrice.toString()}`,
      );
    }

    await tx.holding.upsert({
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
    price: number,
    dto: SellHoldingDto,
  ) {
    const account = await tx.account.findFirst({
      where: {
        user_id: userId,
        selected: true,
      },
    });
    const totalSalePrice = new Prisma.Decimal(price).mul(dto.quantity);

    if (!account) {
      throw new NotFoundException(`No accounts found`);
    }

    //console.log(holding);

    const result = await tx.holding.updateMany({
      where: {
        user_id: userId,
        stock_symbol: dto.stock_symbol,
        quantity: {
          gte: dto.quantity,
        },
      },
      data: {
        quantity: {
          decrement: dto.quantity,
        },
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        `Insufficient shares of ${dto.stock_symbol}`,
      );
    }

    // delete the holding if all shares have been sold
    const updatedHolding = await tx.holding.findUnique({
      where: {
        user_id_stock_symbol: {
          user_id: userId,
          stock_symbol: dto.stock_symbol,
        },
      },
    });

    if (updatedHolding?.quantity.isZero()) {
      await tx.holding.delete({
        where: {
          user_id_stock_symbol: {
            user_id: userId,
            stock_symbol: dto.stock_symbol,
          },
        },
      });
    }

    await tx.account.update({
      where: { id: account.id },
      data: {
        balance: {
          increment: totalSalePrice,
        },
      },
    });
  }

  // method to record a trade in the database
  async recordTrade(
    tx: Prisma.TransactionClient,
    userId: number,
    price: number,
    dto: TradeHolding,
    type: string,
  ) {
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

    //console.log('trades', trades);

    if (trades.length === 0) {
      throw new NotFoundException(
        'Gains can not be retrieved, you have made no trades.',
      );
    }

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
    let lifetimeRealisedGains = 0;
    let lifetimeUnrealisedGains = 0;

    // for each stock the user has traded, calculate the gains for that stock
    for (const stockTrades of groupedTrades.values()) {
      gains = await this.calculateTotalGainsLifetime(stockTrades);
      lifetimeRealisedGains += gains.realised_gains;
      lifetimeUnrealisedGains += gains.unrealised_gains;
    }

    const todaysGains = await this.calculateTotalGainsToday(userId);

    // return total unrealised and realised gains
    return {
      lifetime_realised_gains: lifetimeRealisedGains,
      lifetime_unrealised_gains: lifetimeUnrealisedGains,
      todays_realised_gains: todaysGains.todays_realised_gains,
      todays_unrealised_gains: todaysGains.todays_unrealised_gains,
    };
  }

  // method to calculate the lifetime realised and unrealised gains for each stock using an average cost basis system
  async calculateTotalGainsLifetime(trades: Trade[]): Promise<GainsDto> {
    let quantity = 0;
    let averagePrice = 0;
    let realisedGain = 0;
    let unrealisedGain = 0;

    // get the stock ticker that we are calculating gains for so we can search up it's current price later, allowing us to calculate unrealised gains
    const stockSymbol = trades[0].stock_symbol;

    for (const trade of trades) {
      const tradeQuantity = trade.quantity.toNumber();
      const tradePrice = trade.price.toNumber();

      if (trade.type === 'buy') {
        const totalCost = quantity * averagePrice + tradeQuantity * tradePrice;

        quantity += tradeQuantity;
        averagePrice = totalCost / quantity;
      } else {
        realisedGain += (tradePrice - averagePrice) * tradeQuantity;
        quantity -= tradeQuantity;

        if (quantity === 0) {
          averagePrice = 0;
        }
      }
    }

    // if the user still owns a stock, then we calculate the unrealised gain
    if (quantity > 0) {
      const price = (
        await this.stockPriceService.getPrice({
          stock_symbol: stockSymbol,
        })
      ).current;

      unrealisedGain = quantity * (price - averagePrice);
      //console.log('stock: ' + stockSymbol);
      //console.log('quantity: ' + quantity);
      //console.log('unrealised gain: ' + unrealisedGain);
    }
    return {
      realised_gains: realisedGain,
      unrealised_gains: unrealisedGain,
    };
  }

  async calculateTotalGainsToday(userId: number) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfDay);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const [holdings, tradesToday] = await Promise.all([
      this.prisma.holding.findMany({
        where: { user_id: userId },
        select: {
          stock_symbol: true,
          quantity: true,
        },
      }),

      this.prisma.trade.findMany({
        where: {
          user_id: userId,
          created_at: {
            gte: startOfDay,
            lt: startOfTomorrow,
          },
        },
        orderBy: { created_at: 'asc' },
      }),
    ]);

    // start with current holdings
    const openingQuantities = new Map<string, number>();

    for (const holding of holdings) {
      openingQuantities.set(holding.stock_symbol, holding.quantity.toNumber());
    }

    // include stocks traded today even if no current holding exists
    for (const trade of tradesToday) {
      if (!openingQuantities.has(trade.stock_symbol)) {
        openingQuantities.set(trade.stock_symbol, 0);
      }
    }

    // reverse today's trades to reconstruct opening quantities
    for (const trade of [...tradesToday].reverse()) {
      const quantity = trade.quantity.toNumber();
      const currentOpeningQuantity = openingQuantities.get(trade.stock_symbol)!;

      if (trade.type === 'buy') {
        openingQuantities.set(
          trade.stock_symbol,
          currentOpeningQuantity - quantity,
        );
      } else if (trade.type === 'sell') {
        openingQuantities.set(
          trade.stock_symbol,
          currentOpeningQuantity + quantity,
        );
      }
    }

    // fetch one quote per stock
    const symbols = [...openingQuantities.keys()];

    const quotes = await Promise.all(
      symbols.map(async (symbol) => {
        const quote = await this.stockPriceService.getPrice({
          stock_symbol: symbol,
        });

        return [symbol, quote] as const;
      }),
    );

    const prices = new Map(quotes);

    let realisedGains = 0;
    let unrealisedGains = 0;

    // track each stock's daily quantity and daily average cost basis
    const positions = new Map<
      string,
      { quantity: number; averagePrice: number }
    >();

    for (const [symbol, openingQuantity] of openingQuantities) {
      const quote = prices.get(symbol)!;

      positions.set(symbol, {
        quantity: openingQuantity,
        averagePrice: openingQuantity > 0 ? quote.open : 0,
      });
    }

    // Process today's trades in chronological order.
    for (const trade of tradesToday) {
      const position = positions.get(trade.stock_symbol)!;
      const quantity = trade.quantity.toNumber();
      const price = trade.price.toNumber();

      if (trade.type === 'buy') {
        const totalCost =
          position.quantity * position.averagePrice + quantity * price;

        position.quantity += quantity;

        position.averagePrice =
          position.quantity > 0 ? totalCost / position.quantity : 0;
      } else if (trade.type === 'sell') {
        realisedGains += quantity * (price - position.averagePrice);

        position.quantity -= quantity;

        if (position.quantity === 0) {
          position.averagePrice = 0;
        }
      }
    }

    // Remaining shares contribute to today's unrealised gains.
    for (const [symbol, position] of positions) {
      const quote = prices.get(symbol)!;

      if (position.quantity > 0) {
        unrealisedGains +=
          position.quantity * (quote.current - position.averagePrice);
      }
    }

    return {
      todays_realised_gains: realisedGains,
      todays_unrealised_gains: unrealisedGains,
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

    //console.log('history', data);

    if (data.length === 0) {
      throw new NotFoundException(
        'History was not retrieved. Either make some trades or change the search filters.',
      );
    }

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
