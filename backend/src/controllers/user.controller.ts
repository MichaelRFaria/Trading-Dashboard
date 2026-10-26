import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterAccountDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // endpoint to register a user account
  @Post('register')
  async register(@Body() registerAccountDto: RegisterAccountDto) {
    return this.userService.register(registerAccountDto);
  }

  // endpoint to retrieve the current user (used primarily to ensure the user is authenticated)
  // AuthGuard will attach a 'user' object to the request (assuming their JWT is valid)
  @UseGuards(AuthGuard)
  @Get('me')
  GetCurrentUser(@Req() request) {
    // if the 'user' object exists, then the user must is authenticated, if it does not exist then this returns null, and handling will be done by the frontend
    return request.user;
  }
}
