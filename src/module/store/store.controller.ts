import { Body, Controller, Get, Param, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { StoreService } from "./store.service";
import { RegisterStoreDTO } from "./dtos/register-store.dto";
import { Store } from "src/model/store.model";
import { LoginStoreDTO } from "./dtos/login-store.dto";
import { currentStore } from "src/decorator/current-store.decorator";
import { RolesGuard } from "src/common/guard/role.guard";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum/role.enum";

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
    async register(@Body() body: RegisterStoreDTO) {
        const newStore = await this.storeService.create(body);
        return newStore;
    }

    @Post('/login')
    async login(@Body() body: LoginStoreDTO) {
        const store = await this.storeService.login(body);
        return store;
    }
    @Put('/logout')
    @Roles(ERole.Store)
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
    async confirmStore(@Res() res, @Query('email') email: string, @Query('token') token: string) {
        const verifyStore = await this.storeService.confirmStore(email, token)
        if (verifyStore) {
            res.status(201).json(verifyStore)
        }
        return verifyStore
    }
}