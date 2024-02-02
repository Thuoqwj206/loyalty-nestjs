import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Item, Order, OrderItem } from "src/model";
import { Repository } from "typeorm";

@Injectable()
export class OrderItemService {
    constructor(
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,

    ) { }
    async findItemsOfOrder(order: Order): Promise<OrderItem[]> {
        return this.orderItemRepository.find({ relations: ['item'], where: { order: order } });
    }
    async createOrderItem(order: Order, quantity: number, item: Item) {
        await this.orderItemRepository.create({
            quantity, order, item
        }).save()
        return { order: order.id, item: item.name, quantity: quantity }
    }

}   