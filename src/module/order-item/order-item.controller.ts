import { Body, Controller, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { OrderItemService } from "./order-item.service";

@Controller('/order-item')
export class OrderItemController {
    constructor(private readonly orderItemService: OrderItemService) { }

    @Get()
    async findAll() {
        return await this.orderItemService.findAll()
    }

    // @Get('/:id')
    // async findStoreOrderItem(@Query('id') id: number) {
    //     return await this.orderItemService.findStoreOrderItem(id)
    // }

    // @Roles(ERole.STORE)
    // @UseGuards(RolesGuard)
    // @Post()
    // async createOrderItem(@Body() body: CreateOrderItemDTO, @currentStore() store) {
    //     return await this.orderItemService.addNewOrderItem(body, store)

    // }

    @Put('/:id/add-quantity')
    async addQuantity(@Query('id') id: number, quantity: number) {
        return await this.addQuantity(id, quantity)
    }

    @Put('/:id/reduce-quantity')
    async reduceQuantity(@Query('id') id: number, quantity: number) {
        return await this.reduceQuantity(id, quantity)
    }
}