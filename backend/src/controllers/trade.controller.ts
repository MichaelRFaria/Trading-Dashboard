import {Body, Controller, Get, Post, Query, Req, UseGuards} from "@nestjs/common";
import {AuthGuard} from "../guards/auth.guard";
import {TradeExecutionService} from "../services/tradeexecution.service";
import {TradeService} from "../services/trade.service";
import {BuyHoldingDto, HistoryLookupDto, SellHoldingDto} from "../dto/trade.dto";

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

    @UseGuards(AuthGuard)
    @Get("history")
    async getHistory(@Query() historyLookupDto: HistoryLookupDto, @Req() request) {
        const userId = request.user.sub;

        return this.tradeService.getHistory(userId, historyLookupDto)
    }
}