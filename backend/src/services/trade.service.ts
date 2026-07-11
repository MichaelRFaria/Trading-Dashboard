import {Injectable} from "@nestjs/common";
import {PrismaService} from "./prisma.service";
import {GainsDto, TradeHolding} from "../dto/holdings.dto";
import {Prisma, Trade} from "@prisma/client";
import {FinnhubService} from "./finnhub.service";
import {FinnhubPriceLookupDto} from "../dto/finnhub.dto"

@Injectable()
export class TradeService {
    constructor(private readonly prisma: PrismaService,
                private readonly finnhubService: FinnhubService) {
    }

    async recordTrade(tx: Prisma.TransactionClient, userId: number, dto: TradeHolding, type: string) {
        const stockSymbolLookup: FinnhubPriceLookupDto = {
            stock_symbol: dto.stock_symbol,
            type: "current"
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
    async getGains(userId: number) {
        // get trades chronoligcally, this is important as every buy changes the cost basis of future sells
        const trades = await this.prisma.trade.findMany({
            where: {
                user_id: userId
            },
            orderBy: {
                createdAt: "asc"
            }
        })

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

        let gains: GainsDto;
        let totalRealisedGains = 0
        let totalUnrealisedGains = 0;

        for (const stockTrades of groupedTrades.values()) {
            gains = await this.calculateGains(stockTrades)
            totalRealisedGains += gains.realised_gains
            totalUnrealisedGains += gains.unrealised_gains
        }


        return {
            realised_gains: totalRealisedGains,
            unrealised_gains: totalUnrealisedGains
        }
    }

    // calculate realised gains for each stock using an average cost basis system (could look into FIFO/LIFO cost basis systems in the future)
    async calculateGains(trades: Trade[]): Promise<GainsDto> {
        let quantity = 0
        let averagePrice = 0
        let realisedGain = 0
        let unrealisedGain = 0;

        // this is stupid, but this works as trades is a subset of retrieved entries from the db, so it will never be null/empty
        // we need the stock symbol in order to retrieve the current price of the stock we are calculating gains for, allowing us to calculate the unrealised gains
        const stockSymbol = trades[0].stock_symbol

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

        if (quantity > 0) {
            const currPrice = await this.finnhubService.getPrice({stock_symbol: stockSymbol, type: "current"})

            unrealisedGain = quantity * (currPrice - averagePrice)
            console.log("stock: " + stockSymbol)
            console.log("quantity: " + quantity)
            console.log("unrealised gain: " + unrealisedGain)

        }

        return {
            realised_gains: realisedGain,
            unrealised_gains: unrealisedGain,
        }
    }
}