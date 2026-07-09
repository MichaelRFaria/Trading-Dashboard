import {Injectable} from "@nestjs/common";
import {FinnhubPriceLookupDto, FinnhubSymbolLookupDto} from "../dto/finnhub.dto";
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

    async getPrice(dto: FinnhubPriceLookupDto) {
        const {data} = await firstValueFrom(
            this.httpService.get("https://finnhub.io/api/v1/quote", {
                    params: {
                        symbol: dto.stock_symbol,
                        token: process.env.FINNHUB_API_KEY,
                    }
                }
            ))

        // see https://finnhub.io/docs/api/quote for other prices that can be retrieved
        switch (dto.type) {
            case "current":
                return data.c
            case "change":
                return data.d
        }

        return null; // todo only alternate accepted return type for now
    }
}