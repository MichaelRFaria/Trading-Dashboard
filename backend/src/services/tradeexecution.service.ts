import {Injectable} from "@nestjs/common";
import {BuyHoldingDto, BuyHoldingResultDto, SellHoldingDto, SellHoldingResultDto} from "../dto/holdings.dto";
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

            const payload = new BuyHoldingResultDto()
            payload.success = true
            payload.message = `Successfully bought ${dto.quantity} shares of ${dto.stock_symbol} at $${trade.price} per share`
            return payload
        } catch (error) {
            console.log(error)
            const payload = new BuyHoldingResultDto()
            payload.success = false
            payload.message = "An error occurred, the trade was not executed"
            return payload
        }
    }


    async sell(userId: number, dto: SellHoldingDto) {
        try {
            const trade = await this.prisma.$transaction(async (tx) => {
                await this.holdingService.sell(tx, userId, dto)
                return await this.tradeService.recordTrade(tx, userId, dto, "sell")
            })

            const payload = new SellHoldingResultDto()
            payload.success = true
            payload.message = `Successfully sold ${dto.quantity} shares of ${dto.stock_symbol} at $${trade.price} per share`
            return payload
        } catch (error) {
            console.log(error)
            const payload = new SellHoldingResultDto()
            payload.success = false
            payload.message = "An error occurred, the trade was not executed"
            return payload
        }
    }
}