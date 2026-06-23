import {Injectable} from "@nestjs/common";
import {PrismaService} from "./prisma.service";
import {TradeHolding} from "../dto/holdings.dto";
import {Prisma} from "@prisma/client";
import {FinnhubService} from "./finnhub.service";
import {FinnhubSymbolLookupDto} from "../dto/finnhub-symbol-lookup.dto"

@Injectable()
export class TradeService {
    constructor(private readonly prisma: PrismaService,
                private readonly finnhubService: FinnhubService) {
    }

    async recordTrade(tx: Prisma.TransactionClient, userId: number, dto: TradeHolding, type: string) {
        const stockSymbolLookup: FinnhubSymbolLookupDto = {
            stock_symbol: dto.stock_symbol
        }

        const price = await this.finnhubService.getPrice(stockSymbolLookup)

        return tx.trade.create({
            data: {
                stock_symbol: dto.stock_symbol,
                quantity: dto.quantity,
                price: price,
                type: type,
                user_id: userId
            }
        })
    }
}