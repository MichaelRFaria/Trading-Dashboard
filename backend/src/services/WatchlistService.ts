import {Injectable} from "@nestjs/common";
import {PrismaService} from "./PrismaService";
import {AddToWatchlistDto} from "../dto/AddToWatchlistDto";
import {DeleteFromWatchlistDto} from "../dto/DeleteFromWatchlistDto";

@Injectable()
export class WatchlistService {
    constructor(private prisma: PrismaService) {
    }

    async add(dto: AddToWatchlistDto) {
        const existingEntry = await this.prisma.watchlist.findFirst({
            where: {
                stock_symbol: dto.stock_symbol,
                user_id: dto.user_id,
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
                    user_id: dto.user_id,
                }
            })

            return {
                success: true,
                message: `${dto.stock_symbol} successfully added to watchlist.`
            }
        } catch (error) {
            return {
                success: false,
                message: "An error occurred"
            }
        }
    }

    async delete(dto: DeleteFromWatchlistDto) {
        const existingEntry = await this.prisma.watchlist.findFirst({
            where: {
                stock_symbol: dto.stock_symbol,
                user_id: dto.user_id,
            }
        })

        if (!existingEntry) {
            return {
                success: false,
                message: `${dto.stock_symbol} is not in your watchlist.`
            }
        }

        try {
            await this.prisma.watchlist.deleteMany({
                where: {
                    stock_symbol: dto.stock_symbol,
                    user_id: dto.user_id,
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