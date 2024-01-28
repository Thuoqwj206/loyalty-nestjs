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

    async findAll(): Promise<OrderItem[]> {
        const orders = await this.orderItemRepository.find();
        if (orders) {
            return orders
        }
        return null
    }

    async findItemsOfOrder(order: Order): Promise<OrderItem[]> {
        const orders = await this.orderItemRepository.find({ relations: ['item'], where: { order: order } });
        if (orders) {
            return orders
        }
        return null
    }


    async createOrderItem(order: Order, quantity: number, item: Item): Promise<OrderItem> {
        const newOrderItem = await this.orderItemRepository.create({
            quantity, order, item
        })
        return await this.orderItemRepository.save(newOrderItem)
    }

}   