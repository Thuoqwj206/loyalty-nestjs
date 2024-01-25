import { Inject, Injectable, NotAcceptableException, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderItem } from "src/model";
import { Repository } from "typeorm";
import { ItemService } from "../item/item.service";
import { StoreService } from "../store/store.service";
import { OrderService } from "../order/order.service";
import { CreateOrderItemDTO } from "./dtos";

@Injectable()
export class OrderItemService {
    constructor(
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        private readonly storeService: StoreService,
        private readonly itemService: ItemService,
        @Inject(forwardRef(() => OrderService))
        private readonly orderService: OrderService

    ) { }

    async findAll(): Promise<OrderItem[]> {
        const orders = await this.orderItemRepository.find();
        if (orders) {
            return orders
        }
        return null
    }

    async createOrderItem(id: number, body: CreateOrderItemDTO) {
        const { itemId, quantity } = body
        const item = await this.itemService.findOne(itemId)
        if (!item) {
            throw new NotFoundException('Not found that item')
        }
        if (quantity > item.quantityAvailable) {
            throw new NotAcceptableException(`Item ${item.name} does not have enough`)
        }
        const order = await this.orderService.findOne(id)
        const newOrderItem = this.orderItemRepository.create({
            quantity, order, item
        })
        await this.orderItemRepository.save(newOrderItem)
        return newOrderItem
    }
    // async findStoreorderItem(id: number): Promise<OrderItem[]> {
    //     const store = await this.storeService.findOne(id)
    //     const orders = await this.orderRepository.find({ where: { store } })
    //     if (orders) {
    //         return orders
    //     }
    //     return null
    // }

    // async addNeworderItem(body: CreateorderItemDTO, store) {
    //     const { name } = body
    //     const orderitem = await this.orderRepository.findOne({ where: { name } })
    //     if (orderitem) {
    //         throw new NotAcceptableException('Existed OrderItem Name')
    //     }
    //     const targetStore = await this.storeService.findOne(store?.id)
    //     const neworderItem = await this.orderRepository.create(body)
    //     await this.orderRepository.save({
    //         ...neworderItem,
    //         store: targetStore
    //     })
    //     return neworderItem
    // }

}   