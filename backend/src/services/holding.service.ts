import {PrismaService} from "./prisma.service";
import {Injectable} from "@nestjs/common";
import {BuyHoldingDto} from "../dto/holdings.dto";
import {SellHoldingDto} from "../dto/holdings.dto";
import {Prisma} from "@prisma/client";
import {FinnhubService} from "./finnhub.service";
import {FinnhubPriceChangeDataItemDto, FinnhubPriceChangeDto} from "../dto/finnhub.dto";

@Injectable()
export class HoldingService {
    constructor(private readonly prisma: PrismaService,
                private readonly finnhubService: FinnhubService) {
    }

    async getHoldings(userId: number) {
        const data = await this.prisma.holding.findMany({
            where: {
                user_id: userId
            }
        })

        if (data) {
            console.log(data)
            return {
                data: data
            }
        } else {
            return {
                success: false,
                message: "No watchlist items found"
            }
        }
    }

    async buy(tx: Prisma.TransactionClient, userId: number, dto: BuyHoldingDto) {
        return tx.holding.upsert({
            where: {
                user_id_stock_symbol: {
                    stock_symbol: dto.stock_symbol,
                    user_id: userId,
                }
            },
            update: {
                quantity: {
                    increment: dto.quantity
                }
            },
            create: {
                stock_symbol: dto.stock_symbol,
                quantity: dto.quantity,
                user_id: userId,
            }
        });

    }

    async sell(tx: Prisma.TransactionClient, userId: number, dto: SellHoldingDto) {
        const holding = await tx.holding.update({
            where: {
                user_id_stock_symbol: {
                    user_id: userId,
                    stock_symbol: dto.stock_symbol,
                }
            },
            data: {
                quantity: {
                    decrement: dto.quantity
                }
            }
        })

        if (holding.quantity.toNumber() <= 0) {
            return tx.holding.delete({ // probably a better way to do this since we have holding (???)
                where: {
                    user_id_stock_symbol: {
                        user_id: userId,
                        stock_symbol: dto.stock_symbol
                    }
                }
            });
        }

        return holding
    }

    // gets todays price changes by iterating through each of the user's holdings and making requests to Finnhub's API
    async getHoldingsPriceChanges(userId: number) {
        const holdings = await this.prisma.holding.findMany({
            where: {
                user_id: userId
            },
        })

        const priceChanges = [] as FinnhubPriceChangeDataItemDto[]

        for (const holding of holdings) {
            const priceChange = await this.finnhubService.getPrice({stock_symbol: holding.stock_symbol, type: "change"})

            priceChanges.push({stock_symbol: holding.stock_symbol, price_change: priceChange})
        }

        const payload = new FinnhubPriceChangeDto()
        payload.data = priceChanges
        return payload
    }
}