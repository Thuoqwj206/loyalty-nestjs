import { Inject, Injectable, NotAcceptableException, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { StoreService } from "../store/store.service";
import { UserService } from "../user/user.service";
import { Gift, GiftExchange, GiftOrder, Store, User } from "src/model";
import { GiftService } from "../gift/gift.service";
import { GiftExchangeService } from "../gift-exchange/gift-exchange.service";
import { CreateGiftExchangeDTO } from "../gift-exchange/dtos";
import { GIFT_MESSAGES, ORDER_MESSAGES, USER_MESSAGES } from "src/constant/messages";
import { CreateGiftOrderDTO } from "./dtos";

@Injectable()
export class GiftOrderService {
    constructor(
        @InjectRepository(GiftOrder)
        private giftOrderRepository: Repository<GiftOrder>,
        private dataSource: DataSource,
        private readonly storeService: StoreService,
        private readonly userService: UserService,
        private readonly giftService: GiftService,
        private readonly giftExchangeService: GiftExchangeService
    ) { }

    async findAll(): Promise<GiftOrder[]> {
        const giftOrders = await this.giftOrderRepository.find();
        if (giftOrders) {
            return giftOrders
        }
        return null
    }

    async findOne(id: number): Promise<GiftOrder> {
        const giftOrder = await this.giftOrderRepository.findOne({ where: { id } });
        if (giftOrder) {
            return giftOrder
        }
        return null
    }

    async findStoreGiftOrder(id: number): Promise<GiftOrder[]> {
        const store = await this.storeService.findOne(id)
        const giftOrders = await this.giftOrderRepository.find({ where: { store } })
        if (giftOrders) {
            return giftOrders
        }
        return null
    }

    async createNewGiftOrder(body: CreateGiftOrderDTO, store: Store) {
        const user = await this.userService.findByPhone(body.phone)
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        const targetStore = await this.storeService.findByEmail(store.email)
        const newGiftOrder = await this.giftOrderRepository.create({
            user: user,
            store: targetStore,
        }).save()
        return this.giftOrderRepository.findOne({ where: { id: newGiftOrder.id }, select: ['id', 'createDate'] })
    }

    async completeGiftOrder(id: number) {
        const giftOrder = await this.giftOrderRepository.findOne({ relations: ['user', 'store'], where: { id } })
        if (!giftOrder) {
            throw new NotAcceptableException(ORDER_MESSAGES.NOT_FOUND)
        }
        if (giftOrder.totalPoints != 0) {
            throw new NotAcceptableException(GIFT_MESSAGES.NOT_ACCEPTED)
        }
        const giftExchanges = await this.giftExchangeService.findExchangesOfGiftOrder(giftOrder)
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            giftExchanges.map(async (giftExchange) => {
                giftOrder.totalPoints += (giftExchange.gift?.pointRequired * giftExchange.quantity)
                const result = await this.giftService.reduceQuantity(giftExchange.gift.id, giftExchange.quantity)
                await queryRunner.manager.save(Gift, {
                    ...result.gift,
                    quantityAvailable: result.newQuantity
                })
            })
            if (giftOrder.user.point < giftOrder.totalPoints) {
                throw new NotAcceptableException(GIFT_MESSAGES.NOT_ENOUGH_POINT(giftOrder.totalPoints, giftOrder.user.point))
            }
            const result = await this.userService.reducePoint(giftOrder.user.id, giftOrder.totalPoints)
            await queryRunner.manager.save(User, {
                ...result.user,
                point: result.newPoint
            })
            const newOrder = await queryRunner.manager.save(GiftOrder, {
                ...giftOrder,
                giftExchanges,
                createDate: new Date()
            })
            await queryRunner.commitTransaction();
            return { id: newOrder.id, Gifts: newOrder.giftExchanges, TotalPoint: newOrder.totalPoints, Created: newOrder.createDate }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new NotAcceptableException(ORDER_MESSAGES.ORDER_FAILED(error));
        }
    }

    async getOrderDetail(id: number): Promise<{ id: number, Gifts: GiftExchange[], TotalPoint: number }> {
        const order = await this.giftOrderRepository.findOne({ relations: ['user', 'store'], where: { id } })
        if (!order) {
            throw new NotFoundException(ORDER_MESSAGES.NOT_FOUND)
        }
        const orderGifts = await this.giftExchangeService.findExchangesOfGiftOrder(order)
        if (order.totalPoints > 0) {
            return { id: order.id, Gifts: orderGifts, TotalPoint: order.totalPoints }
        } else {
            orderGifts.map(async (orderGift) => {
                order.totalPoints += (orderGift.gift?.pointRequired * orderGift.quantity)
            })
        }
        return { id: order.id, Gifts: orderGifts, TotalPoint: order.totalPoints }
    }

    async addGiftExchange(id: number, body: CreateGiftExchangeDTO) {
        const { giftId, quantity } = body
        const gift = await this.giftService.findOne(giftId)
        const existOrder = await this.giftOrderRepository.findOne({ where: { id } })
        if (!existOrder) {
            throw new NotFoundException(ORDER_MESSAGES.NOT_FOUND)
        }
        if (!gift) {
            throw new NotFoundException(GIFT_MESSAGES.NOT_FOUND)
        }
        if (existOrder.totalPoints > 0) {
            throw new NotAcceptableException(ORDER_MESSAGES.ORDER_CANNOT_OVERRIDE)
        }
        if (quantity > gift.quantityAvailable) {
            throw new NotAcceptableException(GIFT_MESSAGES.REDUCTION_QUANTITY_GREATER_THAN_AVAILABLE(quantity, gift.quantityAvailable))
        }
        const giftOrder = await this.giftOrderRepository.findOne({ where: { id } })
        return this.giftExchangeService.createGiftExchange(giftOrder, quantity, gift)
    }

}   