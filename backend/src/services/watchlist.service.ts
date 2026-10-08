import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  AddToWatchlistDto,
  DeleteFromWatchlistDto,
} from '../dto/watchlist.dto';

@Injectable()
export class WatchlistService {
  constructor(private prisma: PrismaService) {}

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

    const existingEntry = await this.prisma.watchlist.findFirst({
      where: {
        stock_symbol: dto.stock_symbol,
        user_id: userId,
      },
    });

    if (existingEntry) {
      throw new ConflictException('Stock already exists in watchlist');
    }

    try {
      await this.prisma.watchlist.create({
        data: {
          stock_symbol: dto.stock_symbol,
          user_id: userId,
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
}
