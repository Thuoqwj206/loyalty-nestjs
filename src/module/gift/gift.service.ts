import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GIFT_MESSAGES } from "src/constant/messages";
import { Gift, Store } from "src/model";
import { MoreThan, Repository } from "typeorm";
import { CreateGiftDTO } from "./dtos";
import { UpdateGiftDTO } from "./dtos/update-gift.dto";
import { Url } from "url";

@Injectable()
export class GiftService {
    constructor(
        @InjectRepository(Gift)
        private giftRepository: Repository<Gift>,
    ) { }

    async findAll(): Promise<Gift[]> {
        const gifts = await this.giftRepository.find();
        if (gifts) {
            return gifts
        }
        return null
    }

    async isGiftInStore(id: number, store: Store): Promise<boolean> {
        const gift = await this.giftRepository.findOne({ where: { id }, relations: ['store'] })
        if (!gift) {
            throw new NotFoundException(GIFT_MESSAGES.NOT_FOUND)
        }
        if (gift.store.id !== store.id) {
            return false
        } else { return true }
    }

    async findOne(id: number): Promise<Gift> {
        const gift = await this.giftRepository.findOne({ where: { id } });
        if (gift) {
            return gift
        }
        return null
    }

    async findStoreGift(store: Store): Promise<Gift[]> {
        return this.giftRepository.find({ where: { store } })
    }
    async findAvailableGifts(store: Store): Promise<Gift[]> {
        return this.giftRepository.findBy({
            store: store,
            quantityAvailable: MoreThan(0),
            expirationDate: MoreThan(new Date())
        })
    }
    async addNewGift(body: CreateGiftDTO, store: Store, image: Url): Promise<Gift> {
        const { name } = body
        const gift = await this.giftRepository.findOne({ where: { name } })
        if (gift) {
            throw new NotAcceptableException(GIFT_MESSAGES.EXISTED_GIFT_NAME)
        }
        const newGift = await this.giftRepository.create(body)
        await this.giftRepository.save({
            ...newGift,
            store,
            image
        })
        return newGift
    }

    async update(body: UpdateGiftDTO, id: number, image: Url): Promise<Gift> {
        const gift = await this.giftRepository.findOne({ where: { id } })
        if (!gift) {
            throw new NotAcceptableException(GIFT_MESSAGES.NOT_FOUND)
        }
        return this.giftRepository.save({
            ...gift,
            ...body,
            image
        })
    }

    async delete(id: number): Promise<{ message: string }> {
        const item = await this.giftRepository.findOne({ where: { id } })
        if (!item) {
            throw new NotFoundException(GIFT_MESSAGES.NOT_FOUND)
        }
        this.giftRepository.remove(item)
        return { message: GIFT_MESSAGES.DELETED }
    }

    async addQuantity(id: number, quantity: number): Promise<Gift> {
        const gift = await this.giftRepository.findOne({ where: { id } })
        if (!gift) {
            throw new NotFoundException(GIFT_MESSAGES.NOT_FOUND)
        }
        return this.giftRepository.save({
            ...gift,
            quantityAvailable: gift.quantityAvailable + quantity
        })
    }

    async reduceQuantity(id: number, quantity: number): Promise<{ gift: Gift, newQuantity: number }> {
        const gift = await this.giftRepository.findOne({ where: { id } })
        if (!gift) {
            throw new NotFoundException(GIFT_MESSAGES.NOT_FOUND)
        }
        if (gift.quantityAvailable < quantity) {
            throw new NotAcceptableException(GIFT_MESSAGES.REDUCTION_QUANTITY_GREATER_THAN_AVAILABLE(quantity, gift.quantityAvailable))
        }
        const newQuantity = gift.quantityAvailable - quantity
        return { gift, newQuantity }
    }

}   