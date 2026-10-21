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
import { AccountService } from './account.service';

@Injectable()
export class TradeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stockPriceService: StockPriceService,
    private readonly accountService: AccountService,
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
