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
  UpdateWatchlistDto,
} from '../dto/watchlist.dto';
import { WatchlistService } from '../services/watchlist.service';
import { AuthGuard } from '../guards/auth.guard';
import type { AuthenticatedRequest } from '../types/misc';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  // endpoint for retrieving all watchlist stocks a user has, from the database
  @UseGuards(AuthGuard)
  @Get('watchlist')
  async getWatchlist(@Req() request: AuthenticatedRequest) {
    const userId = request.user.sub;

    return this.watchlistService.getWatchlist(Number(userId));
  }

  // endpoint for adding a stock to the user's watchlist
  @UseGuards(AuthGuard)
  @Post('add')
  async add(
    @Body() addToWatchlistDto: AddToWatchlistDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.watchlistService.add(Number(userId), addToWatchlistDto);
  }

  // endpoint for removing a stock to the user's watchlist
  @UseGuards(AuthGuard)
  @Delete('delete')
  async delete(
    @Body() deleteFromWatchlistDto: DeleteFromWatchlistDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.watchlistService.delete(Number(userId), deleteFromWatchlistDto);
  }

  // endpoint for updating a stock in the user's watchlist
  @UseGuards(AuthGuard)
  @Post('update')
  async update(
    @Body() updateWatchlistDto: UpdateWatchlistDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.watchlistService.update(Number(userId), updateWatchlistDto);
  }

  // endpoint for retrieving prices for all holdings a user has
  @UseGuards(AuthGuard)
  @Get('prices')
  async getWatchlistPrices(@Req() request: AuthenticatedRequest) {
    const userId = request.user.sub;

    return this.watchlistService.getWatchlistPrices(Number(userId));
  }
}
