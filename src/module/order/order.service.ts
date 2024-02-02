import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ORDER_MESSAGES } from "src/constant/messages";
import { ITEM_MESSAGES } from "src/constant/messages/item.message";
import { Item, Order, Store, User } from "src/model";
import { DataSource, EntityManager, QueryRunner, Repository } from "typeorm";
import { ItemService } from "../item/item.service";
import { CreateOrderItemDTO } from "../order-item/dtos";
import { OrderItemService } from "../order-item/order-item.service";
import { StoreService } from "../store/store.service";
import { UserService } from "../user/user.service";
import { CreateOrderDTO } from "./dtos";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private dataSource: DataSource,
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

    async findStoreOrder(store: Store): Promise<Order[]> {
        const targetStore = await this.storeService.findOne(store.id)
        const orders = await this.orderRepository.find({ where: { store: targetStore } })
        if (orders) {
            return orders
        }
        return null
    }

    async IsItemInOrder(order: Order, item: Item): Promise<boolean> {
        const items = await this.orderItemService.findItemsOfOrder(order)
        for (const orderItem of items) {
            if (orderItem.item.id === item.id) {
                return true
            }
        } return false
    }

    async createNewOrder(body: CreateOrderDTO, store: Store) {
        const user = await this.userService.findByPhone(body.phone)
        const targetStore = await this.storeService.findOne(store.id)
        const newOrder = await this.orderRepository.create({
            user: user,
            store: targetStore,
        }).save()
        return this.orderRepository.findOne({ where: { id: newOrder.id }, select: ['id', 'createDate'] })
    }
    async getOrderDetail(id: number) {
        const order = await this.orderRepository.findOne({ relations: ['user', 'store'], where: { id } })
        if (!order) {
            throw new NotFoundException(ORDER_MESSAGES.NOT_FOUND)
        }
        const orderItems = await this.orderItemService.findItemsOfOrder(order)
        orderItems.map(async (orderItem) => {
            order.totalPrice += (orderItem.item?.price * orderItem.quantity)
        })
        return { id: order.id, Items: orderItems, Price: order.totalPrice }
    }

    async completeOrder(id: number) {
        const order = await this.orderRepository.findOne({ relations: ['user', 'store'], where: { id } })
        if (!order) {
            throw new NotFoundException(ORDER_MESSAGES.NOT_FOUND)
        }
        if (order.totalPrice != 0) {
            throw new NotAcceptableException(ORDER_MESSAGES.ORDER_CANNOT_OVERRIDE)
        }
        const orderItems = await this.orderItemService.findItemsOfOrder(order)
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            orderItems.map(async (orderItem) => {
                order.totalPrice += (orderItem.item?.price * orderItem.quantity)
                const result = await this.itemService.reduceQuantity(orderItem.item.id, orderItem.quantity)
                await queryRunner.manager.save(Item, {
                    ...result.item,
                    quantityAvailable: result.newQuantity
                })
            })
            const result = await this.userService.accumulatePoint(order.user, order.totalPrice)
            await queryRunner.manager.save(User, {
                ...result.user,
                point: result.point
            })
            const newOrder = await queryRunner.manager.save(Order, {
                ...order,
                orderItems,
                createDate: new Date()
            })
            await queryRunner.commitTransaction();
            return { id: newOrder.id, Items: newOrder.orderItems, Price: newOrder.totalPrice, Created: newOrder.createDate }

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new NotAcceptableException(`Order Failed: ${error}`);
        } finally {
            await queryRunner.release();
        }
    }

    async addOrderItem(id: number, body: CreateOrderItemDTO) {
        const { itemId, quantity } = body
        const item = await this.itemService.findById(itemId)
        const existOrder = await this.orderRepository.findOne({ where: { id } })
        if (!existOrder) {
            throw new NotFoundException(ORDER_MESSAGES.NOT_FOUND)
        }
        if (existOrder.totalPrice > 0) {
            throw new NotAcceptableException(ORDER_MESSAGES.ORDER_CANNOT_OVERRIDE)
        }
        if (!item) {
            throw new NotFoundException(ITEM_MESSAGES.NOT_FOUND)
        }
        if (await this.IsItemInOrder(existOrder, item)) {
            throw new NotAcceptableException('This item is already in cart')
        }
        if (quantity > item.quantityAvailable) {
            throw new NotAcceptableException(ITEM_MESSAGES.REDUCTION_QUANTITY_GREATER_THAN_AVAILABLE)
        }
        return this.orderItemService.createOrderItem(existOrder, quantity, item)
    }

}   