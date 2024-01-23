import { Body, Controller, Get, Param, Post, Put, Query, Render } from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterUserDTO } from "./dtos/register-user.dto";
import { OTPConfirmDTO } from "./dtos/otp-confirm.dto";
import { currentStore } from "src/decorator/current-store.decorator";
import { Store } from "src/model/store.model";
import { LoginUserDTO } from "./dtos/login-user.dto";

@Controller('user')
export class UsersController {
    constructor(private readonly userService: UserService) { }
    @Get()
    async getAll() {
        return this.userService.findAll()
    }

    @Post()
    async register(@Body() body: RegisterUserDTO) {
        const newUser = await this.userService.create(body);
        return newUser;
    }

    @Post('/login')
    async login(@Body() body: LoginUserDTO) {
        const user = await this.userService.login(body);
        return user;
    }

    @Post('/confirm/:email')
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