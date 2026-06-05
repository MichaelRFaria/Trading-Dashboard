import { Module } from '@nestjs/common';
import {UserController} from "./controllers/UserController";
import {UserService} from "./services/UserService";
import {PrismaService} from "./services/PrismaService";
import {WatchlistService} from "./services/WatchlistService";
import {WatchlistController} from "./controllers/WatchlistController";

@Module({
  imports: [],
  controllers: [UserController, WatchlistController],
  providers: [UserService, WatchlistService, PrismaService],
})
export class AppModule {}
