import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { StoreService } from "./store.service";
import { RegisterStoreDTO } from "./dtos/register-store.dto";

@Controller('store')
export class StoresController {
    constructor(private readonly storeService: StoreService) { }
    @Get()
    async getAll() {
        return this.storeService.findAll()
    }

    @Post()
    async register(@Body() body: RegisterStoreDTO) {
        const newStore = await this.storeService.create(body);
        return newStore;
    }

    @Get('/verify')
    async verifyEmail(@Query('email') email: string, @Query('token') token: string) {
        const verifyEmail = await this.storeService.verifyEmail(email, token)
        return verifyEmail
    }

    @Get('/confirm')
    async confirmStore(@Query('email') email: string, @Query('token') token: string) {
        const verifyStore = await this.storeService.confirmStore(email, token)
        return verifyStore
    }
}