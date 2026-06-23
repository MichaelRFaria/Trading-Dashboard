import {BadRequestException, Injectable} from "@nestjs/common";
import {RegisterAccountDto} from "../dto/register-account.dto";
import {PrismaService} from "./prisma.service";

import * as bcrypt from "bcrypt";
import {LoginAccountDto} from "../dto/login-account.dto";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {
    }
    async register(dto: RegisterAccountDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (existingUser) {
            return {
                success: false,
                message: "A user with this email already exists"
            }
        }

        const hash = await bcrypt.hash(dto.password, 10)

        try {
             await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash
                }
            })

            return {
                success: true,
                message: "Successfully registered an account"
            }
        } catch (error) {
            return {
                success: false,
                message: "Account did not register, please try again."
            }
        }
    }
}