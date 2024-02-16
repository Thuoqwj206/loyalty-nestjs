import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guard/role.guard";
import { currentStore } from "src/decorator/current-store.decorator";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum";
import { Store } from "src/model";
import { GiftOrderService } from "./gift-order.service";
import { CreateGiftOrderDTO } from "./dtos";
import { CreateGiftExchangeDTO } from "../gift-exchange/dtos";

@Controller('gift-order')
export class GiftOrderController {
    constructor(private readonly giftOrderService: GiftOrderService) { }

    @Get()
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async findAll() {
        return this.giftOrderService.findAll()
    }

    @Get('/:id')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async findStoreGiftOrder(@Param('id') id: number) {
        return this.giftOrderService.getOrderDetail(id)
    }

    @Post()
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async createGiftOrder(@Body() body: CreateGiftOrderDTO, @currentStore() store: Store) {
        return this.giftOrderService.createNewGiftOrder(body, store)
    }

    @Post('/:id')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async addGiftOrderItem(@Body() body: CreateGiftExchangeDTO, @Param('id') id: number) {
        return this.giftOrderService.addGiftExchange(id, body)
    }

    @Post('/:id/complete')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async completeGiftOrder(@Param('id') id: number) {
        return this.giftOrderService.completeGiftOrder(id)
    }
}