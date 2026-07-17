import {Injectable} from "@nestjs/common";
import {
    FinnhubPriceLookupDto,
    FinnhubPriceLookupResultDto,
    FinnhubSymbolLookupDto,
    StockSymbolLookupResultDto
} from "../dto/finnhub.dto";
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

        const payload = new StockSymbolLookupResultDto()
        payload.description = stockData.description
        payload.stock_symbol = stockData.symbol;
        payload.type = stockData.type

        return payload
    }

    async getPrice(dto: FinnhubPriceLookupDto) {
        const {data} = await firstValueFrom(
            this.httpService.get("https://finnhub.io/api/v1/quote", {
                    params: {
                        symbol: dto.stock_symbol,
                        token: process.env.FINNHUB_API_KEY,
                    }
                }
            ))

        const payload = new FinnhubPriceLookupResultDto()

        // see https://finnhub.io/docs/api/quote for other prices that can be retrieved
        switch (dto.type) {
            case "current":
                payload.price = data.c
                break;
            case "change":
                payload.price = data.d
                break;
        }

        if (payload.price) {
            return payload
        } else { // todo improve alternate flow
            console.log("finnhub api did not give a price quote, price has been set to 0 for this request")
            payload.price = 0
            return payload
        }
    }
}