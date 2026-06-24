import {Module} from '@nestjs/common';
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
import {HoldingController} from "../controllers/holding.controller";
import {HoldingService} from "../services/holding.service";
import {TradeController} from "../controllers/trade.controller";
import {TradeService} from "../services/trade.service";
import {TradeExecutionService} from "../services/tradeexecution.service";

@Module({
    imports: [HttpModule, JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: '1h'}
    })
    ],
    controllers: [UserController, WatchlistController, FinnhubController, AuthController, HoldingController, TradeController],
    providers: [UserService, WatchlistService, FinnhubService, PrismaService, AuthService, HoldingService, TradeService, TradeExecutionService],
})
export class AppModule {
}
