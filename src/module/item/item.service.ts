import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITEM_MESSAGES } from "src/constant/messages/item.message";
import { Item, OrderItem, Store } from "src/model";
import { EntityManager, QueryRunner, Repository } from "typeorm";
import { CreateItemDTO } from "./dtos";
import { UpdateItemDTO } from "./dtos/update-item.dto";

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
    ) { }

    async findAll(): Promise<Item[]> {
        return this.itemRepository.find();
    }

    async findById(id: number): Promise<Item> {
        return this.itemRepository.findOne({ where: { id } });
    }
    async findOne(id: number): Promise<Item> {
        const item = await this.itemRepository.findOne({ where: { id } });
        if (item) {
            return item
        }
        return null
    }

    async findStoreItem(store: Store): Promise<Item[]> {
        return this.itemRepository.find({ where: { store: store } })
    }

    async isItemInStore(id: number, store: Store): Promise<boolean> {
        const gift = await this.itemRepository.findOne({ where: { id }, relations: ['store'] })
        if (!gift) {
            throw new NotFoundException(ITEM_MESSAGES.NOT_FOUND)
        }
        if (gift.store.id !== store.id) {
            return false
        } else { return true }
    }

    async addNewItem(body: CreateItemDTO, store: Store) {
        const { name } = body
        const item = await this.itemRepository.findOne({ where: { name } })
        if (item) {
            throw new NotAcceptableException(ITEM_MESSAGES.EXISTED_ITEM_NAME)
        }
        const newItem = await this.itemRepository.create(body)
        await this.itemRepository.save({
            ...newItem,
            store: store
        })
        return newItem
    }

    async update(body: UpdateItemDTO, id: number): Promise<Item> {
        const item = await this.itemRepository.findOne({ where: { id } })
        if (!item) {
            throw new NotAcceptableException(ITEM_MESSAGES.NOT_FOUND)
        }
        const existed = await this.itemRepository.findOne({ where: { name: body.name } })
        if (existed) {
            throw new NotAcceptableException(ITEM_MESSAGES.EXISTED_ITEM_NAME)
        }
        return this.itemRepository.save({
            ...item,
            ...body
        })
    }


    async delete(id: number) {
        const item = await this.itemRepository.findOne({ where: { id } })
        if (!item) {
            throw new NotFoundException(ITEM_MESSAGES.NOT_FOUND)
        }
        this.itemRepository.remove(item)
        return ITEM_MESSAGES.DELETED
    }


    async addQuantity(id: number, quantity: number) {
        const item = await this.itemRepository.findOne({ where: { id } })
        if (!item) {
            throw new NotFoundException(ITEM_MESSAGES.NOT_FOUND)
        }
        this.itemRepository.save({
            ...item,
            quantityAvailable: item.quantityAvailable + quantity
        })
    }

    async reduceQuantity(id: number, quantity: number): Promise<{ item: Item, newQuantity: number }> {
        const item = await this.itemRepository.findOne({ where: { id } })
        if (!item) {
            throw new NotFoundException(ITEM_MESSAGES.NOT_FOUND)
        }
        if (item.quantityAvailable < quantity) {
            throw new NotAcceptableException(ITEM_MESSAGES.REDUCTION_QUANTITY_GREATER_THAN_AVAILABLE)
        }
        const newQuantity = item.quantityAvailable - quantity
        return { item, newQuantity }
    }



}   