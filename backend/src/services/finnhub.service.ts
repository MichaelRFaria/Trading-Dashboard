import {Injectable} from "@nestjs/common";
import {FinnhubSymbolLookupDto} from "../dto/finnhub-symbol-lookup.dto";
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";
import * as process from "process";

@Injectable()
export class FinnhubService {
    constructor(private readonly httpService: HttpService) {
    }

    async symbolLookup(dto: FinnhubSymbolLookupDto) {
        const { data } = await firstValueFrom(
            this.httpService.get("https://finnhub.io/api/v1/search", {
                params: {
                    q: dto.stock_symbol,
                    token: process.env.FINNHUB_API_KEY,
                }
            }
        ))

        return data;
    }
}