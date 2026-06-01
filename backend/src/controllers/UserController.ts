import {Body, Controller, Post} from "@nestjs/common";
import {RegisterAccountDto} from "../dto/RegisterAccountDto";

@Controller('users')
export class UserController {
    @Post("register")
    async register(@Body() registerAccountDto: RegisterAccountDto) {
        return "account created!" // todo call service
    }
}