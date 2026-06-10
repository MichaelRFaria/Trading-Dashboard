import {Body, Controller, Post} from "@nestjs/common";
import {AuthService} from "../services/AuthService";
import {LoginAccountDto} from "../dto/LoginAccountDto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    async login(@Body() loginAccountDto: LoginAccountDto) {
        return this.authService.login(loginAccountDto)
    }
}