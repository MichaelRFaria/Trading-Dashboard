import {Body, Controller, Get, Post, Req, UseGuards} from "@nestjs/common";
import {HoldingService} from "../services/holding.service";
import {BuyHoldingDto, SellHoldingDto} from "../dto/holdings.dto";
import {AuthGuard} from "../guards/auth.guard";
import {TradeExecutionService} from "../services/tradeexecution.service";

@Controller("holdings")
export class HoldingController {
    constructor(private readonly holdingService: HoldingService) {
    }

    @UseGuards(AuthGuard)
    @Get("holdings")
    async getHoldings(@Req() request) {
        const userId = request.user.sub;

        return this.holdingService.getHoldings(userId)
    }
}