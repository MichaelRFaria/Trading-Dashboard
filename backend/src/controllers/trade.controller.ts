import {Body, Controller, Get, Post, Req, UseGuards} from "@nestjs/common";
import {AuthGuard} from "../guards/auth.guard";
import {BuyHoldingDto, SellHoldingDto} from "../dto/holdings.dto";
import {TradeExecutionService} from "../services/tradeexecution.service";
import {TradeService} from "../services/trade.service";

@Controller("trade")
export class TradeController {
    constructor(private readonly tradeService: TradeService,
                private readonly tradeExecutionService: TradeExecutionService) {
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

    @UseGuards(AuthGuard)
    @Get("gains")
    async getGains(@Req() request) {
        const userId = request.user.sub;

        return this.tradeService.getGains(userId)
    }
}