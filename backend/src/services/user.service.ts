import {Injectable} from "@nestjs/common";
import {RegisterAccountDto, RegisterFailureDto, RegisterSuccessDto} from "../dto/account.dto";
import {PrismaService} from "./prisma.service";

import * as bcrypt from "bcrypt";

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
            const payload = new RegisterFailureDto()
            payload.message = "A user with this email already exists"
            return payload
        }

        const hash = await bcrypt.hash(dto.password, 10)

        try {
            await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash
                }
            })

            const payload = new RegisterSuccessDto()
            payload.message = "Successfully registered an account"
            return payload
        } catch (error) {
            console.error(error)
            const payload = new RegisterFailureDto()
            payload.message = "Account did not register, please try again."
            return payload
        }
    }
}