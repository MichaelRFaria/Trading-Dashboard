import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  FinnhubPriceLookupDto,
  FinnhubSymbolLookupDto,
} from '../dto/finnhub.dto';
import { FinnhubService } from '../services/finnhub.service';
import { AuthGuard } from '../guards/auth.guard';
import { StockPriceService } from '../services/stockprice.service';

@Controller('finnhub')
export class FinnhubController {
  constructor(
    private finnHubService: FinnhubService,
    private stockPriceService: StockPriceService,
  ) {}

  // endpoint for performing a basic information lookup on a stock using Finnhub API
  @UseGuards(AuthGuard)
  @Get('symbol-lookup')
  async symbolLookup(@Query() finnHubSymbolLookupDto: FinnhubSymbolLookupDto) {
    return this.finnHubService.symbolLookup(finnHubSymbolLookupDto);
  }

  // endpoint for getting the price of a stock using Finnhub API
  @UseGuards(AuthGuard)
  @Get('price')
  async getPrice(@Query() finnhubPriceLookupDto: FinnhubPriceLookupDto) {
    return this.stockPriceService.getPrice(finnhubPriceLookupDto);
  }
}
