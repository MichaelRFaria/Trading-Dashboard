import {Injectable} from "@nestjs/common";
import {FinnhubSymbolLookupDto} from "../dto/finnhub.dto";
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";
import * as process from "process";

@Injectable()
export class FinnhubService {
    constructor(private readonly httpService: HttpService) {
    }

    async symbolLookup(dto: FinnhubSymbolLookupDto) {
        const {data} = await firstValueFrom(
            this.httpService.get("https://finnhub.io/api/v1/search", {
                    params: {
                        q: dto.stock_symbol,
                        token: process.env.FINNHUB_API_KEY,
                    }
                }
            ))

        const stockData = data.result.find(item => item.symbol === dto.stock_symbol)

        console.log(stockData)

        return stockData;
    }

    async getPrice(dto: FinnhubSymbolLookupDto) {
        const {data} = await firstValueFrom(
            this.httpService.get("https://finnhub.io/api/v1/quote", {
                    params: {
                        symbol: dto.stock_symbol,
                        token: process.env.FINNHUB_API_KEY,
                    }
                }
            ))

        return data.c // current price. see https://finnhub.io/docs/api/quote for other prices that can be retrieved
    }
}