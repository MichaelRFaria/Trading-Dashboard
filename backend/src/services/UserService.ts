import {BadRequestException, Injectable} from "@nestjs/common";
import {RegisterAccountDto} from "../dto/RegisterAccountDto";
import {PrismaService} from "./PrismaService";

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
            throw new BadRequestException()
        }

        const hash = await bcrypt.hash(dto.password, 10)

        return this.prisma.user.create({
            data: {
                email: dto.email,
                password: hash
            }
        })
    }
}