import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
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
import { USER_MESSAGES } from "src/constant/messages";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { UpdateUserDTO } from "./dtos/update-user.dto";

@Controller('user')
export class UsersController {
    constructor(private readonly userService: UserService) { }
    @Get('/all')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async getAll() {
        return this.userService.findAll()
    }
    @Post('/register')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async register(@Res() res: Response, @Body() body: RegisterUserDTO) {
        await this.userService.create(body);
        res.status(200).json(USER_MESSAGES.SENT_OTP)
    }

    @Post('/create')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async create(@Body() body: CreateUserDTO) {
        return await this.userService.createUserAdmin(body);
    }

    @Post('/login')
    async login(@Body() body: LoginUserDTO) {
        return await this.userService.login(body);
    }

    @Put('/logout')
    @Roles(ERole.USER)
    @UseGuards(RolesGuard)
    async logout(@currentUser() user: User) {
        return await this.userService.logout(user);
    }

    @Post('/verify-otp/register')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async confirmUser(@Body() body: OTPConfirmDTO, @currentStore() store: Store) {
        return await this.userService.confirmRegisterOTP(body, store)
    }

    @Post('/verify-otp/login')
    async confirmLogin(@Body() body: OTPConfirmDTO) {
        const verifyUser = await this.userService.confirmLoginOTP(body)
        return verifyUser
    }

    @Put('/update/:id')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async update(@Param('id') id: number, @Body() body: UpdateUserDTO) {
        return await this.userService.updateUser(body, id);
    }

    @Put('/point/:id')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async addPoint(@Param('id') id: number, @Body() point: number) {
        return await this.userService.addPoint(id, point);
    }

    @Delete('/delete/:id')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async delete(@Param('id') id: number) {
        return await this.userService.deleteUser(id);
    }
}   