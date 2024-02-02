import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guard/role.guard";
import { currentStore } from "src/decorator/current-store.decorator";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum";
import { Store } from "src/model";
import { CreateOrderItemDTO } from "../order-item/dtos";
import { OrderService } from "./order.service";
import { CreateOrderDTO } from "./dtos";

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }
    @Get()
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async findStoreOrder(@currentStore() store: Store) {
        return this.orderService.findStoreOrder(store)
    }

    @Get('/:orderId')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async getOrderDetail(@Param('orderId') id: number) {
        return this.orderService.getOrderDetail(id)
    }

    @Post()
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async createNewOrder(@Body() body: CreateOrderDTO, @currentStore() store: Store) {
        return this.orderService.createNewOrder(body, store)
    }

    @Post('/:id')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async addOrderItem(@Body() body: CreateOrderItemDTO, @Param('id') id: number) {
        return this.orderService.addOrderItem(id, body)
    }

    @Post('/:id/complete')
    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    async completeOrder(@Param('id') id: number) {
        return this.orderService.completeOrder(id)
    }
}