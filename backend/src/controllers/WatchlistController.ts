import {Body, Controller, Delete, Post, UseGuards} from "@nestjs/common";
import {AddToWatchlistDto} from "../dto/AddToWatchlistDto";
import {WatchlistService} from "../services/WatchlistService";
import {DeleteFromWatchlistDto} from "../dto/DeleteFromWatchlistDto";
import {AuthGuard} from "../services/AuthGuard";

@Controller("watchlist")
export class WatchlistController {
    constructor(private watchlistService: WatchlistService) {
    }

    @UseGuards(AuthGuard)
    @Post("add")
    async add(@Body() addToWatchlistDto: AddToWatchlistDto) {
        return this.watchlistService.add(addToWatchlistDto);
    }

    @UseGuards(AuthGuard)
    @Delete("delete")
    async delete(@Body() deleteFromWatchlistDto: DeleteFromWatchlistDto) {
        return this.watchlistService.delete(deleteFromWatchlistDto);
    }
}