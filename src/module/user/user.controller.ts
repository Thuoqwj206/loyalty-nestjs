import { Body, Controller, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
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

@Controller('user')
export class UsersController {
    constructor(private readonly userService: UserService) { }
    @Get()
    @Roles(ERole.Store)
    @UseGuards(RolesGuard)
    async getAll() {
        return this.userService.findAll()
    }

    @Post()
    @Roles(ERole.Store)
    @UseGuards(RolesGuard)
    async register(@Body() body: RegisterUserDTO) {
        const newUser = await this.userService.create(body);
        return newUser;
    }

    @Post('/login')
    async login(@Body() body: LoginUserDTO) {
        const user = await this.userService.login(body);
        return user;
    }

    @Put('/logout')
    @Roles(ERole.User)
    @UseGuards(RolesGuard)
    async logout(@currentUser() user: User) {
        await this.userService.logout(user);
    }

    @Post('/confirm/:email')
    @Roles(ERole.Store)
    @UseGuards(RolesGuard)
    async confirmUser(@Query('email') email: string, @Body() body: OTPConfirmDTO, @currentStore() store: Store) {
        const verifyUser = await this.userService.confirmRegisterOTP(email, body, store)
        return verifyUser
    }

    @Post('/confirm-login/:email')
    async confirmLogin(@Query('email') email: string, @Body() body: OTPConfirmDTO) {
        const verifyUser = await this.userService.confirmLoginOTP(email, body)
        return verifyUser
    }
}   