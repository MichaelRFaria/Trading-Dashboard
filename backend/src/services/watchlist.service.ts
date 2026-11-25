import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  AddToWatchlistDto,
  DeleteFromWatchlistDto,
  PriceTypeDto,
  UpdateWatchlistDto,
} from '../dto/watchlist.dto';
import { FinnhubService } from './finnhub.service';
import { WatchlistTargetType as PrismaWatchlistTargetType } from '@prisma/client';

@Injectable()
export class WatchlistService {
  private priceTypeMap = {
    [PriceTypeDto.BUY_BELOW]: PrismaWatchlistTargetType.BUY_BELOW,
    [PriceTypeDto.SELL_ABOVE]: PrismaWatchlistTargetType.SELL_ABOVE,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly finnhubService: FinnhubService,
  ) {}

  // method to retrieve a user's watchlist from the database
  async getWatchlist(userId: number) {
    const data = await this.prisma.watchlist.findMany({
      where: {
        user_id: userId,
      },
    });
    //console.log(data)
    return {
      data: data,
    };
  }

  // method to add stock to the user's watchlist in the database
  async add(userId: number, dto: AddToWatchlistDto) {
    //console.log(typeof userId);
    const { stock_symbol, price_type, price_target, notes } = dto;

    const existingEntry = await this.prisma.watchlist.findFirst({
      where: {
        stock_symbol: dto.stock_symbol,
        user_id: userId,
      },
    });

    if (existingEntry) {
      throw new ConflictException('Stock already exists in watchlist');
    }

    // throws 404 if it can't find the stock via Finnhub API
    await this.finnhubService.symbolLookup({ stock_symbol: dto.stock_symbol });

    try {
      await this.prisma.watchlist.create({
        data: {
          stock_symbol: stock_symbol,
          user_id: userId,
          price_type:
            price_type === PriceTypeDto.OMIT || !price_type
              ? null
              : this.priceTypeMap[price_type],
          price_target:
            price_type === PriceTypeDto.OMIT || !price_type
              ? null
              : price_target,
          notes,
        },
      });

      return {
        success: true,
        message: `${dto.stock_symbol} successfully added to watchlist`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'An error occurred',
      };
    }
  }

  // method to add remove to the user's watchlist in the database
  async delete(userId: number, dto: DeleteFromWatchlistDto) {
    const existingEntry = await this.prisma.watchlist.findFirst({
      where: {
        stock_symbol: dto.stock_symbol,
        user_id: userId,
      },
    });

    if (!existingEntry) {
      return {
        success: false,
        message: `${dto.stock_symbol} is not in your watchlist`,
      };
    }

    try {
      await this.prisma.watchlist.delete({
        where: {
          user_id_stock_symbol: {
            stock_symbol: dto.stock_symbol,
            user_id: userId,
          },
        },
      });

      return {
        success: true,
        message: `${dto.stock_symbol} successfully deleted from watchlist`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'An error occurred',
      };
    }
  }

  async update(userId: number, dto: UpdateWatchlistDto) {
    const existingEntry = await this.prisma.watchlist.findFirst({
      where: {
        stock_symbol: dto.stock_symbol,
        user_id: userId,
      },
    });

    if (!existingEntry) {
      return {
        success: false,
        message: `${dto.stock_symbol} is not in your watchlist`,
      };
    }

    try {
      const { stock_symbol, price_type, price_target, notes } = dto;

      await this.prisma.watchlist.update({
        where: {
          user_id_stock_symbol: {
            user_id: userId,
            stock_symbol,
          },
        },
        data: {
          price_type:
            price_type === PriceTypeDto.OMIT || !price_type
              ? null
              : this.priceTypeMap[price_type],
          price_target:
            price_type === PriceTypeDto.OMIT || !price_type
              ? null
              : price_target,
          notes,
        },
      });

      return {
        success: true,
        message: `${dto.stock_symbol} successfully updated in watchlist`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'An error occurred',
      };
    }
  }

  // method for retrieving prices for all watchlist stocks a user has watched
  async getWatchlistPrices(userId: number) {
    const watchlist = await this.getWatchlist(userId);

    const prices = await Promise.all(
      watchlist.data.map(async (item) => {
        const priceData = await this.finnhubService.getCachedPrice({
          stock_symbol: item.stock_symbol,
        });

        return [item.stock_symbol, priceData] as const;
      }),
    );

    return {
      data: Object.fromEntries(prices),
    };
  }
}
