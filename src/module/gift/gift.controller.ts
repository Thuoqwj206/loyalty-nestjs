import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guard/role.guard";
import { currentStore } from "src/decorator/current-store.decorator";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum";
import { CreateGiftDTO } from "./dtos";
import { GiftService } from "./gift.service";

@Controller('/gift')
export class GiftController {
    constructor(private readonly giftService: GiftService) { }

    @Get()
    async findAll() {
        return await this.giftService.findAll()
    }

    @Get('/available')
    async findAvailable() {
        return await this.giftService.findAvailableGifts()
    }

    @Get('/:id')
    async findStoreGift(@Param('id') id: number) {
        return await this.giftService.findStoreGift(id)
    }

    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Post()
    async createGift(@Body() body: CreateGiftDTO, @currentStore() store) {
        return await this.giftService.addNewGift(body, store)
    }

    @Put('/:id/add')
    async addQuantity(@Param('id') id: number, @Body() body) {
        return await this.giftService.addQuantity(id, body)
    }

    @Put('/:id/reduce')
    async reduceQuantity(@Param('id') id: number, @Body() quantity: number) {
        return await this.giftService.reduceQuantity(id, quantity)
    }
}