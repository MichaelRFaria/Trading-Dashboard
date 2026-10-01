import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import { LoginAccountDto } from '../dto/account.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // method to verify submitted account details against the database
  async login(dto: LoginAccountDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!existingUser) {
      return {
        message: 'This email is not registered with an account',
      };
    }

    // compare password hashes
    const validPassword = await bcrypt.compare(
      dto.password,
      existingUser.password,
    );

    if (validPassword) {
      // if the account is verified, then we generate an access_token and return it
      // the controller will then attach the access_token as a cookie in the response
      const jwtPayload = { sub: existingUser.id, email: existingUser.email }; // 'sub' holding the user's id keeps to JWT standards
      const access_token = await this.jwtService.signAsync(jwtPayload);

      return {
        access_token: access_token,
      };
    } else {
      return {
        message: 'Incorrect password',
      };
    }
  }
}
