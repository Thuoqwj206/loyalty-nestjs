import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Gift, Store } from "src/model";
import { LessThan, MoreThan, Repository } from "typeorm";
import { StoreService } from "../store/store.service";
import { CreateGiftDTO } from "./dtos";
import { GIFT_MESSAGES } from "src/constant/messages";

@Injectable()
export class GiftService {
    constructor(
        @InjectRepository(Gift)
        private giftRepository: Repository<Gift>,
        private readonly storeService: StoreService
    ) { }

    async findAll(): Promise<Gift[]> {
        const gifts = await this.giftRepository.find();
        if (gifts) {
            return gifts
        }
        return null
    }

    async findOne(id: number): Promise<Gift> {
        const gift = await this.giftRepository.findOne({ where: { id } });
        if (gift) {
            return gift
        }
        return null
    }

    async findStoreGift(id: number): Promise<Gift[]> {
        const store = await this.storeService.findOne(id)
        const gifts = await this.giftRepository.find({ where: { store } })
        if (gifts) {
            return gifts
        }
        return null
    }
    async findAvailableGifts(): Promise<Gift[]> {
        return await this.giftRepository.findBy({
            quantityAvailable: MoreThan(0),
            expirationDate: MoreThan(new Date())
        })
    }
    async addNewGift(body: CreateGiftDTO, store) {
        const { name } = body
        const gift = await this.giftRepository.findOne({ where: { name } })
        if (gift) {
            throw new NotAcceptableException(GIFT_MESSAGES.EXISTED_GIFT_NAME)
        }
        const targetStore = await this.storeService.findOne(store?.id)
        const newGift = await this.giftRepository.create(body)
        await this.giftRepository.save({
            ...newGift,
            store: targetStore
        })
        return newGift
    }


    async addQuantity(id: number, body) {
        const { quantity } = body
        const gift = await this.giftRepository.findOne({ where: { id } })
        if (!gift) {
            throw new NotFoundException(GIFT_MESSAGES.NOT_FOUND)
        }
        return this.giftRepository.save({
            ...gift,
            quantityAvailable: gift.quantityAvailable + quantity
        })
    }

    async reduceQuantity(id: number, quantity: number) {
        const gift = await this.giftRepository.findOne({ where: { id } })
        if (!gift) {
            throw new NotFoundException(GIFT_MESSAGES.NOT_FOUND)
        }
        if (gift.quantityAvailable < quantity) {
            throw new NotAcceptableException(GIFT_MESSAGES.REDUCTION_QUANTITY_GREATER_THAN_AVAILABLE(quantity, gift.quantityAvailable))
        }
        return await this.giftRepository.save({
            ...gift,
            quantityAvailable: gift.quantityAvailable - quantity
        })
    }

}   