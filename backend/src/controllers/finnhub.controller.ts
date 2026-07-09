import {Controller, Get, Query, UseGuards} from "@nestjs/common";
import {FinnhubPriceChangeDto, FinnhubPriceLookupDto, FinnhubSymbolLookupDto} from "../dto/finnhub.dto";
import {FinnhubService} from "../services/finnhub.service";
import {AuthGuard} from "../guards/auth.guard";

@Controller("finnhub")
export class FinnhubController {
    constructor(private finnHubService: FinnhubService) {
    }

    @UseGuards(AuthGuard)
    @Get("symbol-lookup")
    async symbolLookup(@Query() finnHubSymbolLookupDto: FinnhubSymbolLookupDto) {
        return this.finnHubService.symbolLookup(finnHubSymbolLookupDto);
    }

    @UseGuards(AuthGuard)
    @Get("price")
    async getPrice(@Query() finnhubPriceLookupDto: FinnhubPriceLookupDto) {
        return this.finnHubService.getPrice(finnhubPriceLookupDto)
    }
}