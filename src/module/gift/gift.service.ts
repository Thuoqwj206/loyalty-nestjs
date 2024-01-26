import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Gift, Store } from "src/model";
import { Repository } from "typeorm";
import { StoreService } from "../store/store.service";
import { CreateGiftDTO } from "./dtos";

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

    async addNewGift(body: CreateGiftDTO, store) {
        const { name } = body
        const gift = await this.giftRepository.findOne({ where: { name } })
        if (gift) {
            throw new NotAcceptableException('Existed Gift Name')
        }
        const targetStore = await this.storeService.findOne(store?.id)
        const newGift = await this.giftRepository.create(body)
        await this.giftRepository.save({
            ...newGift,
            store: targetStore
        })
        return newGift
    }

    async addQuantity(id: number, quantity: number) {
        const gift = await this.giftRepository.findOne({ where: { id } })
        if (!gift) {
            throw new NotFoundException('Not found any gift')
        }
        return this.giftRepository.save({
            ...gift,
            quantityAvailable: gift.quantityAvailable + quantity
        })
    }

    async reduceQuantity(id: number, quantity: number) {
        const gift = await this.giftRepository.findOne({ where: { id } })
        if (!gift) {
            throw new NotFoundException('Not found any gift')
        }
        if (gift.quantityAvailable < quantity) {
            throw new NotAcceptableException(`Reduction quantity is greater than number of gift available(${gift.quantityAvailable})`)
        }
        return await this.giftRepository.save({
            ...gift,
            quantityAvailable: gift.quantityAvailable - quantity
        })
    }

}   