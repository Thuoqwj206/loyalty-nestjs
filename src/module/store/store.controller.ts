import { Body, Controller, Delete, Get, Param, Post, Put, Query, Redirect, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guard/role.guard";
import { currentStore } from "src/decorator/current-store.decorator";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum/role.enum";
import { Store } from "src/model/store.model";
import { OTPConfirmDTO, UpdateUserDTO } from "../user/dtos";
import { LoginStoreDTO } from "./dtos/login-store.dto";
import { RegisterStoreDTO } from "./dtos/register-store.dto";
import { StoreService } from "./store.service";
import { AddUserPointDTO } from "../user/dtos/add-point.dto";
import { CreateItemDTO } from "../item/dtos";
import { UpdateItemDTO } from "../item/dtos/update-item.dto";
import { CreateGiftDTO } from "../gift/dtos";
import { UpdateGiftDTO } from "../gift/dtos/update-gift.dto";

@Controller('store')
export class StoresController {
    constructor(private readonly storeService: StoreService) { }

    @Get('/users')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async getAllStoreUser(@currentStore() store: Store) {
        return this.storeService.findCurrentStoreUser(store)
    }

    @Put('/users/:userId')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async updateStoreUser(@currentStore() store: Store, @Body() body: UpdateUserDTO, @Param('userId') id: number) {
        return this.storeService.updateCurrentStoreUser(store, body, id)
    }

    @Put('/users/:userId/add-point')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async addUserPoint(@currentStore() store: Store, @Body() body: AddUserPointDTO, @Param('userId') id: number) {
        return this.storeService.addCurrentUserPoint(store, body, id)
    }

    @Delete('/users/:userId')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async deleteStoreUser(@currentStore() store: Store, @Param('userId') id: number) {
        return this.storeService.deleteCurrentStoreUser(store, id)
    }

    @Get('/gifts')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async findStoreGift(@currentStore() store: Store) {
        return this.storeService.findCurrentStoreGift(store)
    }

    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Post('/gifts')
    async createGift(@Body() body: CreateGiftDTO, @currentStore() store) {
        return this.storeService.addStoreGift(store, body)
    }

    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Put('/gifts/:giftId')
    async updateStoreGift(@currentStore() store: Store, @Body() body: UpdateGiftDTO, @Param('giftId') id: number) {
        return this.storeService.updateStoreGift(store, body, id)
    }

    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Delete('/gifts/:giftId')
    async deleteStoreGift(@currentStore() store: Store, @Param('giftId') id: number) {
        return this.storeService.deleteStoreGift(store, id)
    }

    @Get('/items')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async findStoreItem(@currentStore() store: Store) {
        return this.storeService.findCurrentStoreItem(store)
    }

    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Post('/items')
    async createItem(@Body() body: CreateItemDTO, @currentStore() store) {
        return this.storeService.addStoreItem(store, body)
    }

    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Put('/items/:itemId')
    async updateStoreItem(@currentStore() store: Store, @Body() body: UpdateItemDTO, @Param('itemId') id: number) {
        return this.storeService.updateCurrentStoreItem(store, body, id)
    }


    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Delete('/items/:itemId')
    async deleteStoreItem(@currentStore() store: Store, @Param('itemId') id: number) {
        return this.storeService.deleteCurrentStoreItem(store, id)
    }

    @Post()
    async register(@Body() body: RegisterStoreDTO) {
        return this.storeService.register(body);
    }

    @Post('/login')
    async login(@Body() body: LoginStoreDTO) {
        return this.storeService.login(body);
    }

    @Post('/verify-otp/register')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async confirmUser(@Body() body: OTPConfirmDTO, @currentStore() store: Store) {
        return this.storeService.userConfirmOTP(body, store)
    }

    @Put('/logout')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async logout(@currentStore() store: Store) {
        return this.storeService.logout(store);
    }

    @Get('/verify')
    @Redirect('https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran')
    async verifyEmail(@Query('email') email: string, @Query('token') token: string) {
        return this.storeService.verifyEmail(email, token)
    }

    @Get('/confirm')
    async confirmStore(@Query('email') email: string, @Query('token') token: string) {
        return this.storeService.confirmStore(email, token)
    }
}