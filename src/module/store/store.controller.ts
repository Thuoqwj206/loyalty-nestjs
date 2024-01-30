import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { RolesGuard } from "src/common/guard/role.guard";
import { STORE_MESSAGES } from "src/constant/messages";
import { currentStore } from "src/decorator/current-store.decorator";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum/role.enum";
import { Store } from "src/model/store.model";
import { LoginStoreDTO } from "./dtos/login-store.dto";
import { RegisterStoreDTO } from "./dtos/register-store.dto";
import { StoreService } from "./store.service";
import { UpdateStoreDTO } from "./dtos/update-store.dto";

@Controller('store')
export class StoresController {
    constructor(private readonly storeService: StoreService) { }
    @Get()
    async getAll() {
        return this.storeService.findAll()
    }

    @Get('/users')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async getAllStoreUser(@currentStore() store: Store) {
        return this.storeService.findCurrentStoreUser(store)
    }

    @Post()
    async register(@Res() res: Response, @Body() body: RegisterStoreDTO) {
        await this.storeService.register(body);
        res.status(200).json(STORE_MESSAGES.SENT_EMAIL)
    }

    @Post('/create')
    async create(@Res() res: Response, @Body() body: RegisterStoreDTO) {
        return await this.storeService.create(body);
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

    @Put('/update/:id')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async update(@Body() body: UpdateStoreDTO, @Param('id') id: number) {
        await this.storeService.update(body, id);
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

    @Delete('/delete/:id')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async delete(@Param('id') id: number) {
        await this.storeService.delete(id);
    }
}