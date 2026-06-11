import {Controller, Get, Query, UseGuards} from "@nestjs/common";
import {FinnhubSymbolLookupDto} from "../dto/FinnhubSymbolLookupDto";
import {FinnhubService} from "../services/FinnhubService";
import {AuthGuard} from "../services/AuthGuard";

@Controller("finnhub")
export class FinnhubController {
    constructor(private finnHubService: FinnhubService) {
    }

    @UseGuards(AuthGuard)
    @Get("symbol-lookup")
    async symbolLookup(@Query() finnHubSymbolLookupDto: FinnhubSymbolLookupDto) {
        return this.finnHubService.symbolLookup(finnHubSymbolLookupDto);
    }
}