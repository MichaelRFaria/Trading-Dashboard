import {Body, Controller, Post} from "@nestjs/common";
import {AddToWatchlistDto} from "../dto/AddToWatchlistDto";
import {WatchlistService} from "../services/WatchlistService";

@Controller("watchlist")
export class WatchlistController {
    constructor(private watchlistService: WatchlistService) {
    }
    @Post("add")
    async add(@Body() addToWatchlistDto: AddToWatchlistDto) {
        return this.watchlistService.add(addToWatchlistDto);
    }
}