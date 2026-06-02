import { Module } from '@nestjs/common';
import {UserController} from "./controllers/UserController";
import {UserService} from "./services/UserService";
import {PrismaService} from "./services/PrismaService";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class AppModule {}
