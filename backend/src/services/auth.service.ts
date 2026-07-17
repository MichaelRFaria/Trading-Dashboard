import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "./user.service";
import {PrismaService} from "./prisma.service";
import {LoginAccountDto, LoginFailureDto, LoginSuccessDto} from "../dto/account.dto";
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
            const payload = new LoginFailureDto()
            payload.message = "Invalid email"
            return payload
        }

        const validPassword = await bcrypt.compare(
            dto.password,
            existingUser.password,
        )

        if (validPassword) {
            const jwtPayload = {sub: existingUser.id, email: existingUser.email} // sub holding the user id keeps to JWT standards

            const payload = new LoginSuccessDto()
            payload.access_token = await this.jwtService.signAsync(jwtPayload)
            return payload
        } else {
            const payload = new LoginFailureDto()
            payload.message = "Invalid password"
            return payload
        }
    }
}
