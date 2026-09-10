import {Injectable} from "@nestjs/common";
import {PrismaService} from "./prisma.service";
import {Prisma, Trade} from "@prisma/client";
import {FinnhubService} from "./finnhub.service";
import {FinnhubPriceLookupDto} from "../dto/finnhub.dto"
import {GainsDto, HistoryLookupDto, TradeHolding} from "../dto/trade.dto";

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

        const price = (await this.finnhubService.getPrice(stockSymbolLookup)).price

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

        const payload = new GainsDto()
        payload.realised_gains = totalRealisedGains
        payload.unrealised_gains = totalUnrealisedGains
        return payload
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
            const currPrice = (await this.finnhubService.getPrice({
                stock_symbol: stockSymbol,
                type: "current"
            })).price

            unrealisedGain = quantity * (currPrice - averagePrice)
            console.log("stock: " + stockSymbol)
            console.log("quantity: " + quantity)
            console.log("unrealised gain: " + unrealisedGain)

        }

        const payload = new GainsDto()
        payload.realised_gains = realisedGain
        payload.unrealised_gains = unrealisedGain
        return payload
    }

    async getHistory(userId: number, dto: HistoryLookupDto) {
        const where: Prisma.TradeWhereInput = {
            user_id: userId,
        };

        if (dto.stock_symbol !== undefined) {
            where.stock_symbol = dto.stock_symbol;
        }

        if (dto.quantity_from !== undefined || dto.quantity_to !== undefined) {
            where.quantity = {
                ...(dto.quantity_from !== undefined && {
                    gte: dto.quantity_from,
                }),
                ...(dto.quantity_to !== undefined && {
                    lte: dto.quantity_to,
                }),
            };
        }

        if (dto.price_from !== undefined || dto.price_to !== undefined) {
            where.price = {
                ...(dto.price_from !== undefined && {
                    gte: dto.price_from,
                }),
                ...(dto.price_to !== undefined && {
                    lte: dto.price_to,
                }),
            };
        }

        if (dto.type !== undefined) {
            where.type = dto.type;
        }

        if (dto.date_from !== undefined || dto.date_to !== undefined) {
            where.createdAt = {
                ...(dto.date_from !== undefined && {
                    gte: new Date(dto.date_from),
                }),
                ...(dto.date_to !== undefined && {
                    lte: new Date(dto.date_to),
                }),
            };
        }

        const data = await this.prisma.trade.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
        });

        // todo: should probably make service methods return by defining response shape like below, instead of DTOs like current implementations + commented function below
        return {
            data: data.map((trade) => ({
                ...trade,
                createdAt: trade.createdAt.toISOString(),
            })),
        };

        // const payload = new HistoryResultDto();
        //
        // payload.data = data.map((trade) => ({
        //     id: trade.id,
        //     user_id: trade.user_id,
        //     stock_symbol: trade.stock_symbol,
        //     quantity: trade.quantity,
        //     price: trade.price,
        //     type: trade.type,
        //     createdAt: trade.createdAt.toISOString(),
        // }));
        //
        // return payload;

        // // trade.dto.ts
        // export class HistoryResultDto {
        //     data: HistoryDataItem[]
        // }
        //
        // export class HistoryDataItem {
        //     id: number;
        //     user_id: number;
        //     stock_symbol: string;
        //     quantity: number;
        //     price: number;
        //     type: "buy" | "sell";
        //     createdAt: string;
        // }
    }
}
