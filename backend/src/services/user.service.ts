import { Injectable } from '@nestjs/common';
import { RegisterAccountDto } from '../dto/account.dto';
import { PrismaService } from './prisma.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterAccountDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'A user with this email already exists',
      };
    }

    const hash = await bcrypt.hash(dto.password, 10);

    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
      });

      return {
        success: true,
        message: 'Successfully registered an account', // technically don't need a message here. if success = true in frontend, then frontend can generate appropriate response, instead of using this message. need to think which option is the better standard.
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Account did not register, please try again',
      };
    }
  }
}
