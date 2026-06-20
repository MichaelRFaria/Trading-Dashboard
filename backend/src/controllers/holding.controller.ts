import {Body, Controller, Get, Post, Req, UseGuards} from "@nestjs/common";
import {SellHoldingDto} from "../dto/sell-holding.dto";
import {HoldingService} from "../services/holding.service";
import {BuyHoldingDto} from "../dto/buy-holding.dto";
import {AuthGuard} from "../guards/auth.guard";

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

    @UseGuards(AuthGuard)
    @Post("buy")
    async buyHolding(@Body() buyHoldingDto: BuyHoldingDto, @Req() request) {
        const userId = request.user.sub;

        return this.holdingService.buy(userId, buyHoldingDto)
    }

    @UseGuards(AuthGuard)
    @Post("sell")
    async sellHolding(@Body() sellHoldingDto: SellHoldingDto, @Req() request) {
        const userId = request.user.sub;

        return this.holdingService.sell(userId, sellHoldingDto)
    }

}