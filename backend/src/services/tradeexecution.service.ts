import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { HoldingService } from './holding.service';
import { TradeService } from './trade.service';
import { BuyHoldingDto, SellHoldingDto } from '../dto/trade.dto';

@Injectable()
export class TradeExecutionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly holdingService: HoldingService,
    private readonly tradeService: TradeService,
  ) {}

  // method to execute a stock purchase
  async buy(userId: number, dto: BuyHoldingDto) {
    try {
      // database transaction to allow rollback if an error is occurred when updating the database
      const trade = await this.prisma.$transaction(async (tx) => {
        await this.holdingService.buy(tx, userId, dto);
        return await this.tradeService.recordTrade(tx, userId, dto, 'buy');
      });

      return {
        success: true,
        message: `Successfully bought ${dto.quantity} shares of ${dto.stock_symbol} at $${trade.price} per share`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'An error occurred, the trade was not executed',
      };
    }
  }

  // method to execute a stock sell
  async sell(userId: number, dto: SellHoldingDto) {
    try {
      // database transaction to allow rollback if an error is occurred when updating the database
      const trade = await this.prisma.$transaction(async (tx) => {
        await this.holdingService.sell(tx, userId, dto);
        return await this.tradeService.recordTrade(tx, userId, dto, 'sell');
      });

      return {
        success: true,
        message: `Successfully sold ${dto.quantity} shares of ${dto.stock_symbol} at $${trade.price} per share`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'An error occurred, the trade was not executed',
      };
    }
  }
}
