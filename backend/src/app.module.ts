import { Module } from '@nestjs/common';
import {UserController} from "./controllers/UserController";
import {UserService} from "./services/UserService";
import {PrismaService} from "./services/PrismaService";
import {WatchlistService} from "./services/WatchlistService";
import {WatchlistController} from "./controllers/WatchlistController";
import {HttpModule} from "@nestjs/axios";
import {FinnhubController} from "./controllers/FinnhubController";
import {FinnhubService} from "./services/FinnhubService";
import {AuthController} from "./controllers/AuthController";
import {AuthService} from "./services/AuthService";
import {JwtModule} from "@nestjs/jwt";
import process from "process";

@Module({
  imports: [HttpModule, JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '60s'}
  })
  ],
  controllers: [UserController, WatchlistController, FinnhubController, AuthController],
  providers: [UserService, WatchlistService, FinnhubService, PrismaService, AuthService],
})
export class AppModule {}
