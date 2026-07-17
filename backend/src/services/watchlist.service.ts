import {Injectable} from "@nestjs/common";
import {PrismaService} from "./prisma.service";
import {
    AddToWatchlistDto,
    DeleteFromWatchlistDto, ModifyWatchlistFailureDto, ModifyWatchlistSuccessDto,
    WatchlistFetchFailureDto,
    WatchlistFetchSuccessDto
} from "../dto/watchlist.dto";
import {HoldingsFetchFailureDto, HoldingsFetchSuccessDto} from "../dto/holdings.dto";

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
            //console.log(data)
            const payload = new WatchlistFetchSuccessDto()
            payload.data = data
            return payload
        } else {
            const payload = new WatchlistFetchFailureDto()
            payload.message = "No watchlist items found"
            return payload
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
            const payload = new ModifyWatchlistFailureDto()
            payload.message = "You have already added this stock to your watchlist."
            return payload
        }

        try {
            await this.prisma.watchlist.create({
                data: {
                    stock_symbol: dto.stock_symbol,
                    user_id: userId,
                }
            })

            const payload = new ModifyWatchlistSuccessDto()
            payload.message = `${dto.stock_symbol} successfully added to watchlist.`
            return payload
        } catch (error) {
            console.error(error)
            const payload = new ModifyWatchlistFailureDto()
            payload.message = "An error occurred"
            return payload
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
            const payload = new ModifyWatchlistFailureDto()
            payload.message = `${dto.stock_symbol} is not in your watchlist.`
            return payload
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

            const payload = new ModifyWatchlistSuccessDto()
            payload.message = `${dto.stock_symbol} successfully deleted from watchlist.`
            return payload
        } catch (error) {
            console.error(error)
            const payload = new ModifyWatchlistFailureDto()
            payload.message = "An error occurred"
            return payload
        }
    }
}