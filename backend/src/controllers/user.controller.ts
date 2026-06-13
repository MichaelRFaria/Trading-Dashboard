import {Body, Controller, Get, Post, UseGuards, Request} from "@nestjs/common";
import {RegisterAccountDto} from "../dto/register-account.dto";
import {UserService} from "../services/user.service";
import {LoginAccountDto} from "../dto/login-account.dto";
import {AuthGuard} from "../guards/auth.guard";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {
    }
    @Post("register")
    async register(@Body() registerAccountDto: RegisterAccountDto) {
        return this.userService.register(registerAccountDto)
    }

    @UseGuards(AuthGuard)
    @Get("me")
    async GetCurrentUser(@Request() req) {
        return req.user;
    }
}