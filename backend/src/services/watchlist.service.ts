import {Injectable} from "@nestjs/common";
import {PrismaService} from "./prisma.service";
import {AddToWatchlistDto, DeleteFromWatchlistDto} from "../dto/watchlist.dto";

@Injectable()
export class WatchlistService {
    constructor(private prisma: PrismaService) {
    }

    async getWatchlist(userId: number) {
        const data = await this.prisma.watchlist.findMany({
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

    async add(userId: number, dto: AddToWatchlistDto) {
        //console.log(typeof userId);

        const existingEntry = await this.prisma.watchlist.findFirst({
            where: {
                stock_symbol: dto.stock_symbol,
                user_id: userId
            }
        })

        if (existingEntry) {
            return {
                success: false,
                message: "You have already added this stock to your watchlist."
            }
        }

        try {
            await this.prisma.watchlist.create({
                data: {
                    stock_symbol: dto.stock_symbol,
                    user_id: userId,
                }
            })

            return {
                success: true,
                message: `${dto.stock_symbol} successfully added to watchlist.`
            }
        } catch (error) {
            //console.error(error)
            return {
                success: false,
                message: "An error occurred"
            }
        }
    }

    async delete(userId: number, dto: DeleteFromWatchlistDto) {
        const existingEntry = await this.prisma.watchlist.findFirst({
            where: {
                stock_symbol: dto.stock_symbol,
                user_id: userId
            }
        })

        if (!existingEntry) {
            return {
                success: false,
                message: `${dto.stock_symbol} is not in your watchlist.`
            }
        }

        try {
            await this.prisma.watchlist.delete({
                where: {
                    user_id_stock_symbol: {
                        stock_symbol: dto.stock_symbol,
                        user_id: userId
                    }
                }
            })

            return {
                success: true,
                message: `${dto.stock_symbol} successfully deleted from watchlist.`
            }
        } catch (error) {
            return {
                success: false,
                message: "An error occurred"
            }
        }
    }
}