import { Inject, Injectable, NotAcceptableException, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StoreService } from "../store/store.service";
import { UserService } from "../user/user.service";
import { GiftOrder, Store } from "src/model";
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
        if (giftOrder.totalPoints != 0) {
            throw new NotAcceptableException(GIFT_MESSAGES.NOT_ACCEPTED)
        }
        const giftExchanges = await this.giftExchangeService.findExchangesOfGiftOrder(giftOrder)
        giftExchanges.map(async (giftExchange) => {
            giftOrder.totalPoints += (giftExchange.gift?.pointRequired * giftExchange.quantity)
            await this.giftService.reduceQuantity(giftExchange.gift.id, giftExchange.quantity)
        })
        if (giftOrder.user.point < giftOrder.totalPoints) {
            throw new NotAcceptableException('You dont have enough point')
        }
        await this.userService.reducePoint(giftOrder.user.id, giftOrder.totalPoints)
        const newOrder = await this.giftOrderRepository.save({
            ...giftOrder,
            giftExchanges,
            createDate: new Date()
        })
        return { id: newOrder.id, Items: newOrder.giftExchanges, Price: newOrder.totalPoints, Created: newOrder.createDate }
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
            throw new NotAcceptableException(GIFT_MESSAGES.REDUCTION_QUANTITY_GREATER_THAN_AVAILABLE)
        }
        const giftOrder = await this.giftOrderRepository.findOne({ where: { id } })
        return this.giftExchangeService.createGiftExchange(giftOrder, quantity, gift)
    }

}   