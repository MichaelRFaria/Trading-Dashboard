import {Body, Controller, Post} from "@nestjs/common";
import {RegisterAccountDto} from "../dto/RegisterAccountDto";
import {UserService} from "../services/UserService";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {
    }
    @Post("register")
    async register(@Body() registerAccountDto: RegisterAccountDto) {
        return this.userService.register(registerAccountDto)
    }
}