import { Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITEM_MESSAGES } from "src/constant/messages/item.message";
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
    async updateOrderItem(order: Order, quantity: number, item: Item) {
        const orderItem = await this.orderItemRepository.findOne({ where: { order, item }, relations: ['item'] })
        if (orderItem.quantity + quantity > orderItem.item.quantityAvailable) {
            throw new NotAcceptableException(ITEM_MESSAGES.REDUCTION_QUANTITY_GREATER_THAN_AVAILABLE)
        }
        const newOrderItem = await this.orderItemRepository.save({
            ...orderItem,
            quantity: orderItem.quantity + quantity
        })
        return { order: newOrderItem.id, item: newOrderItem.item.name, quantity: newOrderItem.quantity }
    }
}   