import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guard/role.guard";
import { currentStore } from "src/decorator/current-store.decorator";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum";
import { CreateOrderDTO } from "./dtos";
import { OrderService } from "./order.service";
import { Store } from "src/model";
import { CreateOrderItemDTO } from "../order-item/dtos";

@Controller('/order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get()
    async findAll() {
        return await this.orderService.findAll()
    }

    @Get('/:id')
    async findStoreOrder(@Param('id') id: number) {
        return await this.orderService.findStoreOrder(id)
    }

    @Post('/:userId/new')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async createNewOrder(@Param('userId') id: number, @currentStore() store: Store) {
        return await this.orderService.createNewOrder(id, store)
    }

    @Post('/:id')
    async addOrderItem(@Body() body: CreateOrderItemDTO, @Param('id') id: number) {
        return await this.orderService.addOrderItem(id, body)
    }

    @Post('/:id/complete')
    async completeOrder(@Param('id') id: number) {
        return await this.orderService.completeOrder(id)
    }
}