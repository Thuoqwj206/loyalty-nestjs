import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guard/role.guard";
import { currentStore } from "src/decorator/current-store.decorator";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum";
import { Store } from "src/model";
import { GiftOrderService } from "./gift-order.service";
import { CreateGiftOrderDTO } from "./dtos";
import { CreateGiftExchangeDTO } from "../gift-exchange/dtos";

@Controller('/gift-order')
export class GiftOrderController {
    constructor(private readonly giftOrderService: GiftOrderService) { }

    @Get()
    async findAll() {
        return await this.giftOrderService.findAll()
    }

    @Get('/:id')
    async findStoreGiftOrder(@Param('id') id: number) {
        return await this.giftOrderService.findStoreGiftOrder(id)
    }

    @Post('/:userId/new')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async createGiftOrder(@Param('userId') id: number, @currentStore() store: Store) {
        return await this.giftOrderService.createNewGiftOrder(id, store)
    }

    @Post('/:id')
    async addGiftOrderItem(@Body() body: CreateGiftExchangeDTO, @Param('id') id: number) {
        return await this.giftOrderService.addGiftExchange(id, body)
    }

    @Post('/:id/complete')
    async completeGiftOrder(@Param('id') id: number) {
        return await this.giftOrderService.completeGiftOrder(id)
    }
}