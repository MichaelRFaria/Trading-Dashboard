import { Module } from '@nestjs/common';
import {UserController} from "../controllers/user.controller";
import {UserService} from "../services/user.service";
import {PrismaService} from "../services/prisma.service";
import {WatchlistService} from "../services/watchlist.service";
import {WatchlistController} from "../controllers/watchlist.controller";
import {HttpModule} from "@nestjs/axios";
import {FinnhubController} from "../controllers/finnhub.controller";
import {FinnhubService} from "../services/finnhub.service";
import {AuthController} from "../controllers/auth.controller";
import {AuthService} from "../services/auth.service";
import {JwtModule} from "@nestjs/jwt";
import process from "process";

@Module({
  imports: [HttpModule, JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h'}
  })
  ],
  controllers: [UserController, WatchlistController, FinnhubController, AuthController],
  providers: [UserService, WatchlistService, FinnhubService, PrismaService, AuthService],
})
export class AppModule {}
