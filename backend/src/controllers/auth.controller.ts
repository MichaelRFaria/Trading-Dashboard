import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginAccountDto } from '../dto/account.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginAccountDto: LoginAccountDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const res = await this.authService.login(loginAccountDto);

    if (res.access_token) {
      response.cookie('access_token', res.access_token, {
        httpOnly: true,
        secure: false, // should be true outside of dev purposes
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      });
    }

    return res;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: false, // should be true outside of dev purposes
      sameSite: 'lax',
    });

    return {
      success: true,
      message: 'Successfully logged out',
    };
  }
}
