import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterAccountDto } from '../dto/user.dto';
import { PrismaService } from './prisma.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // method to register an account
  async register(dto: RegisterAccountDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          Account: {
            create: {
              selected: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Successfully registered an account',
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
