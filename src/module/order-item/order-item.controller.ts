import { Controller, Get } from "@nestjs/common";
import { OrderItemService } from "./order-item.service";

@Controller('/order-item')
export class OrderItemController {
    constructor(private readonly orderItemService: OrderItemService) { }

}