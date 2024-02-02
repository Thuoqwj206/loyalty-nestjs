import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Gift, GiftExchange, GiftOrder } from "src/model";
import { Repository } from "typeorm";

@Injectable()
export class GiftExchangeService {
    constructor(
        @InjectRepository(GiftExchange)
        private giftExchangeRepository: Repository<GiftExchange>,

    ) { }

    async findAll(): Promise<GiftExchange[]> {
        const orders = await this.giftExchangeRepository.find();
        if (orders) {
            return orders
        }
        return null
    }

    async findExchangesOfGiftOrder(order: GiftOrder): Promise<GiftExchange[]> {
        const orders = await this.giftExchangeRepository.find({ relations: ['gift'], where: { giftOrder: order } });
        if (orders) {
            return orders
        }
        return null
    }


    async createGiftExchange(order: GiftOrder, quantity: number, gift: Gift) {
        const newGiftExchange = await this.giftExchangeRepository.create({
            giftOrder: order, quantity, gift
        })
        await this.giftExchangeRepository.save(newGiftExchange)
        return { order: order.id, item: gift.name, quantity: quantity }
    }

}   