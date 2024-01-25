import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { OrderItemService } from "./order-item.service";
import { CreateOrderItemDTO } from "./dtos";

@Controller('/order-item')
export class OrderItemController {
    constructor(private readonly orderItemService: OrderItemService) { }

    @Get()
    async findAll() {
        return await this.orderItemService.findAll()
    }

    @Post('/:id')
    async addOrderItem(@Body() body: CreateOrderItemDTO, @Param('id') id: number) {
        return await this.orderItemService.addOrderItem(id, body)
    }
}