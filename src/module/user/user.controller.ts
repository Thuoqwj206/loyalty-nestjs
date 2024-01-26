import { Body, Controller, Get, Param, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guard/role.guard";
import { currentStore } from "src/decorator/current-store.decorator";
import { Store } from "src/model/store.model";
import { LoginUserDTO } from "./dtos/login-user.dto";
import { OTPConfirmDTO } from "./dtos/otp-confirm.dto";
import { RegisterUserDTO } from "./dtos/register-user.dto";
import { UserService } from "./user.service";
import { ERole } from "src/enum/role.enum";
import { Roles } from "src/decorator/role.decorator";
import { currentUser } from "src/decorator/current-user.decorator";
import { User } from "src/model/user.model";
import { Response, Request } from "express";

@Controller('user')
export class UsersController {
    constructor(private readonly userService: UserService) { }
    @Get()
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async getAll() {
        return this.userService.findAll()
    }

    @Post('register')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async register(@Res() res: Response, @Body() body: RegisterUserDTO) {
        await this.userService.create(body);
        res.status(200).json('The OTP verification code is sent to your phone number. It would expire after 1 minute')
    }

    @Post('/login')
    async login(@Body() body: LoginUserDTO) {
        const user = await this.userService.login(body);
        return user;
    }

    @Put('/logout')
    @Roles(ERole.USER)
    @UseGuards(RolesGuard)
    async logout(@currentUser() user: User) {
        await this.userService.logout(user);
    }

    @Post('/verify-otp/register')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async confirmUser(@Body() body: OTPConfirmDTO, @currentStore() store: Store) {
        const verifyUser = await this.userService.confirmRegisterOTP(body, store)
        return verifyUser
    }

    // @Get('/sms')
    // async sendSMS() {
    //     return this.userService.sendSMS()
    // }

    @Post('/verify-otp/login')
    async confirmLogin(@Query('email') email: string, @Body() body: OTPConfirmDTO) {
        const verifyUser = await this.userService.confirmLoginOTP(email, body)
        return verifyUser
    }
}   