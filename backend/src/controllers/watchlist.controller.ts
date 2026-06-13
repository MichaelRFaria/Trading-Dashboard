import {Body, Controller, Delete, Post, UseGuards} from "@nestjs/common";
import {AddToWatchlistDto} from "../dto/add-to-watchlist.dto";
import {WatchlistService} from "../services/watchlist.service";
import {DeleteFromWatchlistDto} from "../dto/delete-from-watchlist.dto";
import {AuthGuard} from "../guards/auth.guard";

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