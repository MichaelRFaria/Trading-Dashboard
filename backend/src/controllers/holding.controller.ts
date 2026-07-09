import {Controller, Get, Req, UseGuards} from "@nestjs/common";
import {HoldingService} from "../services/holding.service";
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
    @Get("price-changes")
    async getHoldingsPriceChanges(@Req() request) {
        const userId = request.user.sub;

        return this.holdingService.getHoldingsPriceChanges(userId)
    }
}