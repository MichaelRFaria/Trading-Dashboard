import {Body, Controller, Delete, Post} from "@nestjs/common";
import {AddToWatchlistDto} from "../dto/AddToWatchlistDto";
import {WatchlistService} from "../services/WatchlistService";
import {DeleteFromWatchlistDto} from "../dto/DeleteFromWatchlistDto";

@Controller("watchlist")
export class WatchlistController {
    constructor(private watchlistService: WatchlistService) {
    }
    @Post("add")
    async add(@Body() addToWatchlistDto: AddToWatchlistDto) {
        return this.watchlistService.add(addToWatchlistDto);
    }

    @Delete("delete")
    async delete(@Body() deleteFromWatchlistDto: DeleteFromWatchlistDto) {
        return this.watchlistService.delete(deleteFromWatchlistDto);
    }
}