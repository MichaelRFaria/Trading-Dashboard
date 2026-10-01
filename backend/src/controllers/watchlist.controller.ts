import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AddToWatchlistDto,
  DeleteFromWatchlistDto,
} from '../dto/watchlist.dto';
import { WatchlistService } from '../services/watchlist.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('watchlist')
export class WatchlistController {
  constructor(private watchlistService: WatchlistService) {}

  // endpoint for retrieving all watchlist stocks a user has, from the database
  @UseGuards(AuthGuard)
  @Get('watchlist')
  async getWatchlist(@Req() request) {
    const userId = request.user.sub;

    return this.watchlistService.getWatchlist(userId);
  }

  // endpoint for adding a stock to the user's watchlist
  @UseGuards(AuthGuard)
  @Post('add')
  async add(@Body() addToWatchlistDto: AddToWatchlistDto, @Req() request) {
    const userId = request.user.sub;

    return this.watchlistService.add(userId, addToWatchlistDto);
  }

  // endpoint for removing a stock to the user's watchlist
  @UseGuards(AuthGuard)
  @Delete('delete')
  async delete(
    @Body() deleteFromWatchlistDto: DeleteFromWatchlistDto,
    @Req() request,
  ) {
    const userId = request.user.sub;

    return this.watchlistService.delete(userId, deleteFromWatchlistDto);
  }
}
