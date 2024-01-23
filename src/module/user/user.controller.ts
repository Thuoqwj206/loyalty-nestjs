import { Body, Controller, Get, Param, Post, Put, Query, Render } from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterUserDTO } from "./dtos/register-user.dto";
import { OTPConfirmDTO } from "./dtos/otp-confirm.dto";

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


    @Post('/confirm/:email')
    async confirmUser(@Query('email') email: string, @Body() body: OTPConfirmDTO) {
        const verifyUser = await this.userService.confirmOTP(email, body)
        return verifyUser
    }
}   