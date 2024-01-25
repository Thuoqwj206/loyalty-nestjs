import { Body, Controller, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guard/role.guard";
import { currentStore } from "src/decorator/current-store.decorator";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum";
import { CreateOrderDTO } from "./dtos";
import { OrderService } from "./order.service";

@Controller('/order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get()
    async findAll() {
        return await this.orderService.findAll()
    }

    @Get('/:id')
    async findStoreOrder(@Query('id') id: number) {
        return await this.orderService.findStoreOrder(id)
    }

    @Put('/:id/add-quantity')
    async addQuantity(@Query('id') id: number, quantity: number) {
        return await this.addQuantity(id, quantity)
    }

    @Put('/:id/reduce-quantity')
    async reduceQuantity(@Query('id') id: number, quantity: number) {
        return await this.reduceQuantity(id, quantity)
    }
}