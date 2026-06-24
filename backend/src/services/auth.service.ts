import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "./user.service";
import {PrismaService} from "./prisma.service";
import {LoginAccountDto} from "../dto/account.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private userService: UserService,
        private jwtService: JwtService,
    ) {
    }

    async login(dto: LoginAccountDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (!existingUser) {
            return {
                success: false,
                message: "Invalid email"
            }
        }

        const validPassword = await bcrypt.compare(
            dto.password,
            existingUser.password,
        )

        if (validPassword) {
            const payload = {sub: existingUser.id, email: existingUser.email} // sub holding the user id keeps to JWT standards

            return {
                success: true,
                access_token: await this.jwtService.signAsync(payload)
            }
        } else {
            return {
                success: false,
                message: "Invalid password"
            }
        }
    }
}
