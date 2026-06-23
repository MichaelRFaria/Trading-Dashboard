import {PrismaService} from "./prisma.service";
import {Injectable} from "@nestjs/common";
import {BuyHoldingDto} from "../dto/holdings.dto";
import {SellHoldingDto} from "../dto/holdings.dto";
import {Prisma} from "@prisma/client";

@Injectable()
export class HoldingService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getHoldings(userId: number) {
        const data = await this.prisma.holding.findMany({
            where: {
                user_id: userId
            }
        })

        if (data) {
            console.log(data)
            return data
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
}