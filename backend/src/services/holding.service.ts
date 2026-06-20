import {PrismaService} from "./prisma.service";
import {Injectable} from "@nestjs/common";
import {BuyHoldingDto} from "../dto/buy-holding.dto";
import {SellHoldingDto} from "../dto/sell-holding.dto";

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

    async buy(userId: number, dto: BuyHoldingDto) {
        console.log(dto);
        console.log(dto.quantity);
        console.log(typeof dto.quantity);
        try {
            await this.prisma.holding.upsert({
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
            })

            return {
                success: true,
                message: `Successfully bought ${dto.quantity} of ${dto.stock_symbol}`
            }
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: "An error occurred"
            }
        }
    }

    async sell(userId: number, dto: SellHoldingDto) {
        try {
            const holding = await this.prisma.holding.update({
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
                await this.prisma.holding.delete({ // probably a better way to do this since we have holding (???)
                    where: {
                        user_id_stock_symbol: {
                            user_id: userId,
                            stock_symbol: dto.stock_symbol
                        }
                    }
                })
            }

            return {
                success: true,
                message: `Successfully sold ${dto.quantity} of ${dto.stock_symbol}`
            }
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: "An error occurred"
            }
        }
    }
}