import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TradeService } from './trade.service';
import { BuyHoldingDto, SellHoldingDto } from '../dto/trade.dto';
import { FinnhubService } from './finnhub.service';
import { StockPriceService } from './stockprice.service';

@Injectable()
export class TradeExecutionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tradeService: TradeService,
    private readonly finnhubService: FinnhubService,
    private readonly stockPriceService: StockPriceService,
  ) {}

  // method to execute a stock purchase
  async buy(userId: number, dto: BuyHoldingDto) {
    try {
      const priceData = await this.finnhubService.getPrice({
        stock_symbol: dto.stock_symbol,
      });

      const price = priceData.current;

      // update stock's cached values with updated values while we already have the latest price data
      await this.stockPriceService.updateCache(dto.stock_symbol, priceData);

      // database transaction to allow rollback if an error is occurred when updating the database
      const trade = await this.prisma.$transaction(async (tx) => {
        await this.tradeService.buy(tx, userId, price, dto);
        return await this.tradeService.recordTrade(
          tx,
          userId,
          price,
          dto,
          'buy',
        );
      });

      return {
        success: true,
        message: `Successfully bought ${dto.quantity} shares of ${dto.stock_symbol} at $${trade.price} per share`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error(error);

      throw new InternalServerErrorException(
        'An error occurred, the trade was not executed',
      );
    }
  }

  // method to execute a stock sell
  async sell(userId: number, dto: SellHoldingDto) {
    try {
      const priceData = await this.finnhubService.getPrice({
        stock_symbol: dto.stock_symbol,
      });

      const price = priceData.current;

      // update stock's cached values with updated values while we already have the latest price data
      await this.stockPriceService.updateCache(dto.stock_symbol, priceData);

      // database transaction to allow rollback if an error is occurred when updating the database
      const trade = await this.prisma.$transaction(async (tx) => {
        await this.tradeService.sell(tx, userId, price, dto);
        return await this.tradeService.recordTrade(
          tx,
          userId,
          price,
          dto,
          'sell',
        );
      });

      return {
        success: true,
        message: `Successfully sold ${dto.quantity} shares of ${dto.stock_symbol} at $${trade.price} per share`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error(error);

      throw new InternalServerErrorException(
        'An error occurred, the trade was not executed',
      );
    }
  }
}
