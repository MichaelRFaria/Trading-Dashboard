import {Injectable} from "@nestjs/common";
import {PrismaService} from "./PrismaService";
import {AddToWatchlistDto} from "../dto/AddToWatchlistDto";

@Injectable()
export class WatchlistService{
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

        return this.prisma.watchlist.create({
            data: {
                stock_symbol: dto.stock_symbol,
                user_id: dto.user_id,
            }
        })

    }
}