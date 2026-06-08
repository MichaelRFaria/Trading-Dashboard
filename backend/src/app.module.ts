import { Module } from '@nestjs/common';
import {UserController} from "./controllers/UserController";
import {UserService} from "./services/UserService";
import {PrismaService} from "./services/PrismaService";
import {WatchlistService} from "./services/WatchlistService";
import {WatchlistController} from "./controllers/WatchlistController";
import {HttpModule} from "@nestjs/axios";
import {FinnhubController} from "./controllers/FinnhubController";
import {FinnhubService} from "./services/FinnhubService";

@Module({
  imports: [HttpModule],
  controllers: [UserController, WatchlistController, FinnhubController],
  providers: [UserService, WatchlistService, FinnhubService, PrismaService],
})
export class AppModule {}
