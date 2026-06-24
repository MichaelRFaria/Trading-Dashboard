import {Injectable} from "@nestjs/common";
import {BuyHoldingDto, SellHoldingDto} from "../dto/holdings.dto";
import {PrismaService} from "./prisma.service";
import {HoldingService} from "./holding.service";
import {TradeService} from "./trade.service";

@Injectable()
export class TradeExecutionService {
    constructor(private readonly prisma: PrismaService,
                private readonly holdingService: HoldingService,
                private readonly tradeService: TradeService) {
    }

    async buy(userId: number, dto: BuyHoldingDto) {
        try {
            const trade = await this.prisma.$transaction(async (tx) => {
                await this.holdingService.buy(tx, userId, dto)
                return await this.tradeService.recordTrade(tx, userId, dto, "buy")
            })

            return {
                success: true,
                message: `Successfully bought ${dto.quantity} shares of ${dto.stock_symbol} at $${trade.price} per share`
            }

        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: "An error occurred, the trade was not executed"
            }
        }
    }


    async sell(userId: number, dto: SellHoldingDto) {
        try {
            const trade = await this.prisma.$transaction(async (tx) => {
                await this.holdingService.sell(tx, userId, dto)
                return await this.tradeService.recordTrade(tx, userId, dto, "sell")
            })

            return {
                success: true,
                message: `Successfully sold ${dto.quantity} shares of ${dto.stock_symbol} at $${trade.price} per share`
            }
            
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: "An error occurred, the trade was not executed"
            }
        }
    }
}