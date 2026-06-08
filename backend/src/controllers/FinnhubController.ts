import {Controller, Get, Query} from "@nestjs/common";
import {FinnhubSymbolLookupDto} from "../dto/FinnhubSymbolLookupDto";
import {FinnhubService} from "../services/FinnhubService";

@Controller("finnhub")
export class FinnhubController {
    constructor(private finnHubService: FinnhubService) {
    }
    @Get("symbol-lookup")
    async symbolLookup(@Query() finnHubSymbolLookupDto: FinnhubSymbolLookupDto) {
        return this.finnHubService.symbolLookup(finnHubSymbolLookupDto);
    }
}