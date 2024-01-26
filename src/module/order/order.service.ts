import { Inject, Injectable, NotAcceptableException, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order, OrderItem, Store } from "src/model";
import { Repository } from "typeorm";
import { OrderItemService } from "../order-item/order-item.service";
import { StoreService } from "../store/store.service";
import { UserService } from "../user/user.service";
import { ItemService } from "../item/item.service";
import { CreateOrderItemDTO } from "../order-item/dtos";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private readonly storeService: StoreService,
        private readonly userService: UserService,
        private readonly itemService: ItemService,
        private readonly orderItemService: OrderItemService
    ) { }

    async findAll(): Promise<Order[]> {
        const orders = await this.orderRepository.find();
        if (orders) {
            return orders
        }
        return null
    }

    async findOne(id: number): Promise<Order> {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (order) {
            return order
        }
        return null
    }

    async findStoreOrder(id: number): Promise<Order[]> {
        const store = await this.storeService.findOne(id)
        const orders = await this.orderRepository.find({ where: { store } })
        if (orders) {
            return orders
        }
        return null
    }

    async createNewOrder(userId: number, store: Store) {
        const user = await this.userService.findOne(userId)
        if (!user) {
            throw new NotFoundException('Not found User')
        }
        const targetStore = await this.storeService.findOne(store.id)
        const newOrder = this.orderRepository.create({
            user: user,
            store: targetStore,
        })
        await this.orderRepository.save(newOrder)
    }

    async completeOrder(id: number) {
        const order = await this.orderRepository.findOne({ relations: ['user', 'store'], where: { id } })
        if (order.totalPrice != 0) {
            throw new NotAcceptableException('Order can not be override')
        }
        const orderItems = await this.orderItemService.findItemsOfOrder(order)
        orderItems.map(async (orderItem) => {
            order.totalPrice += (orderItem.item?.price * orderItem.quantity)
            await this.itemService.reduceQuantity(orderItem.item.id, orderItem.quantity)
        })
        order.user = await this.userService.accumulatePoint(order.user, order.totalPrice)
        return await this.orderRepository.save({
            ...order,
            orderItems,
            createDate: new Date()
        })
    }

    async addOrderItem(id: number, body: CreateOrderItemDTO) {
        const { itemId, quantity } = body
        const item = await this.itemService.findOne(itemId)
        if (!item) {
            throw new NotFoundException('Not found that item')
        }
        if (quantity > item.quantityAvailable) {
            throw new NotAcceptableException(`Item ${item.name} does not have enough`)
        }
        const order = await this.orderRepository.findOne({ where: { id } })
        const newOrderItem = this.orderItemService.createOrderItem(order, quantity, item)
        return newOrderItem
    }

}   