import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order, OrderItem } from "src/model";
import { Repository } from "typeorm";
import { OrderItemService } from "../order-item/order-item.service";
import { StoreService } from "../store/store.service";
import { UserService } from "../user/user.service";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private readonly storeService: StoreService,
        private readonly userService: UserService,
        @Inject(forwardRef(() => OrderItemService))
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

    async createNewOrder(userId: number, storeId: number) {
        const user = await this.userService.findOne(userId)
        if (!user) {
            throw new NotFoundException('Not found User')
        }
        const store = await this.storeService.findOne(storeId)
        const newOrder = this.orderRepository.create({
            user: user,
            store: store,
        })
        await this.orderRepository.save(newOrder)
    }

    async completeOrder(id: number) {
        const order = await this.orderRepository.findOne({ where: { id } })
    }

}   