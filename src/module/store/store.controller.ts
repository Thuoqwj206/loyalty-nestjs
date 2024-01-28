import { Body, Controller, Get, Param, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { StoreService } from "./store.service";
import { RegisterStoreDTO } from "./dtos/register-store.dto";
import { Store } from "src/model/store.model";
import { LoginStoreDTO } from "./dtos/login-store.dto";
import { currentStore } from "src/decorator/current-store.decorator";
import { RolesGuard } from "src/common/guard/role.guard";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum/role.enum";
import { Response } from "express";
import { STORE_MESSAGES } from "src/common/messages";

@Controller('store')
export class StoresController {
    constructor(private readonly storeService: StoreService) { }
    @Get()
    async getAll() {
        return this.storeService.findAll()
    }
    @Get()
    async getAllUser(@currentStore() store: Store) {
        return this.getAllUser(store)
    }

    @Post()
    async register(@Res() res: Response, @Body() body: RegisterStoreDTO) {
        await this.storeService.create(body);
        res.status(200).json(STORE_MESSAGES.SENT_EMAIL)
    }

    @Post('/login')
    async login(@Res() res: Response, @Body() body: LoginStoreDTO) {
        await this.storeService.login(body);
        res.status(200).json(STORE_MESSAGES.WAIT_FOR_ADMIN)
    }
    @Put('/logout')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async logout(@currentStore() store: Store) {
        await this.storeService.logout(store);
    }
    @Get('/verify')
    async verifyEmail(@Query('email') email: string, @Query('token') token: string) {
        const verifyEmail = await this.storeService.verifyEmail(email, token)
        return verifyEmail
    }

    @Get('/confirm')
    async confirmStore(@Res() res: Response, @Query('email') email: string, @Query('token') token: string) {
        const verifyStore = await this.storeService.confirmStore(email, token)
        res.status(201).json(verifyStore)
    }
}