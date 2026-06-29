import {Injectable} from "@nestjs/common";
import {PrismaService} from "./prisma.service";
import {TradeHolding} from "../dto/holdings.dto";
import {Prisma, Trade} from "@prisma/client";
import {FinnhubService} from "./finnhub.service";
import {FinnhubSymbolLookupDto} from "../dto/finnhub.dto"

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

    // this could all be calculated when buying and selling stocks, then adding a realised gain and average price attributes to the Holdings table, but this is interesting to implement
    async getRealisedGains(userId: number) {
        // get trades chronoligcally, this is important as every buy changes the cost basis of future sells
        const trades = await this.prisma.trade.findMany({
            where: {
                user_id: userId
        },
        orderBy: {
                createdAt: "asc"
        }})

        const groupedTrades = new Map<string, Trade[]>()

        // group trades by stock symbols todo maybe a way to do this in the prisma method call above, some group by attribute
        for (const trade of trades) {
            const group = groupedTrades.get(trade.stock_symbol)

            if (group) {
                group.push(trade)
            } else {
                groupedTrades.set(trade.stock_symbol, [trade])
            }
        }

        console.log(groupedTrades)

        let totalRealisedGains = 0

        for (const stockTrades of groupedTrades.values()) {
            totalRealisedGains += this.calculateRealisedGain(stockTrades)
        }

        return totalRealisedGains
    }

    // calculate realised gains for each stock using an average cost basis system (could look into FIFO/LIFO cost basis systems in the future)
    calculateRealisedGain(trades: Trade[]) {
        let quantity = 0
        let averagePrice = 0
        let realisedGain = 0

        for (const trade of trades) {
            if (trade.type === "buy") {
                if (quantity !== 0) {
                    averagePrice = ((quantity * averagePrice) + (trade.quantity.toNumber() * trade.price.toNumber())) / (quantity + trade.quantity.toNumber())
                    quantity += trade.quantity.toNumber()
                } else {
                    averagePrice = trade.price.toNumber()
                    quantity = trade.quantity.toNumber()
                }
            } else { // sell
                realisedGain += (trade.price.toNumber() - averagePrice) * trade.quantity.toNumber()
                quantity -= trade.quantity.toNumber()
            }
        }

        return realisedGain;
    }
}