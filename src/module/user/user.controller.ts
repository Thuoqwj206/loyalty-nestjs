import { Body, Controller, Param, Post, Put, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guard/role.guard";
import { currentUser } from "src/decorator/current-user.decorator";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum/role.enum";
import { User } from "src/model/user.model";
import { LoginUserDTO } from "./dtos/login-user.dto";
import { OTPConfirmDTO } from "./dtos/otp-confirm.dto";
import { RegisterUserDTO } from "./dtos/register-user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UsersController {
    constructor(private readonly userService: UserService) { }

    @Post('/register')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async register(@Body() body: RegisterUserDTO) {
        return this.userService.create(body);
    }

    @Post('/login')
    async login(@Body() body: LoginUserDTO) {
        return this.userService.login(body);
    }

    @Put('/logout')
    @Roles(ERole.USER)
    @UseGuards(RolesGuard)
    async logout(@currentUser() user: User) {
        return this.userService.logout(user);
    }

    @Post('/verify')
    async confirmLogin(@Body() body: OTPConfirmDTO) {
        const verifyUser = await this.userService.confirmLoginOTP(body)
        return verifyUser
    }
}   