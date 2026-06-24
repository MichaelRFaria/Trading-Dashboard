import {Body, Controller, Post, Req, UseGuards} from "@nestjs/common";
import {AuthGuard} from "../guards/auth.guard";
import {BuyHoldingDto, SellHoldingDto} from "../dto/holdings.dto";
import {TradeExecutionService} from "../services/tradeexecution.service";

@Controller("trade")
export class TradeController {
    constructor(private readonly tradeExecutionService: TradeExecutionService) {
    }

    @UseGuards(AuthGuard)
    @Post("buy")
    async buyHolding(@Body() buyHoldingDto: BuyHoldingDto, @Req() request) {
        const userId = request.user.sub;

        return this.tradeExecutionService.buy(userId, buyHoldingDto)
    }

    @UseGuards(AuthGuard)
    @Post("sell")
    async sellHolding(@Body() sellHoldingDto: SellHoldingDto, @Req() request) {
        const userId = request.user.sub;

        return this.tradeExecutionService.sell(userId, sellHoldingDto)
    }
}