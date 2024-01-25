import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Item, Store } from "src/model";
import { Repository } from "typeorm";
import { StoreService } from "../store/store.service";
import { CreateItemDTO } from "./dtos";

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        private readonly storeService: StoreService
    ) { }

    async findAll(): Promise<Item[]> {
        const items = await this.itemRepository.find();
        if (items) {
            return items
        }
        return null
    }

    async findOne(id: number): Promise<Item> {
        const item = await this.itemRepository.findOne({ where: { id } });
        if (item) {
            return item
        }
        return null
    }

    async findStoreItem(id: number): Promise<Item[]> {
        const store = await this.storeService.findOne(id)
        const items = await this.itemRepository.find({ where: { store } })
        if (items) {
            return items
        }
        return null
    }

    async addNewItem(body: CreateItemDTO, store) {
        const { name } = body
        const item = await this.itemRepository.findOne({ where: { name } })
        if (item) {
            throw new NotAcceptableException('Existed Item Name')
        }
        const targetStore = await this.storeService.findOne(store?.id)
        const newItem = await this.itemRepository.create(body)
        await this.itemRepository.save({
            ...newItem,
            store: targetStore
        })
        return newItem
    }

    async addQuantity(id: number, quantity: number) {
        const item = await this.itemRepository.findOne({ where: { id } })
        if (!item) {
            throw new NotFoundException('Not found any item')
        }
        this.itemRepository.save({
            ...item,
            quantityAvailable: item.quantityAvailable + quantity
        })
    }

    async reduceQuantity(id: number, quantity: number) {
        const item = await this.itemRepository.findOne({ where: { id } })
        if (!item) {
            throw new NotFoundException('Not found any item')
        }
        if (item.quantityAvailable < quantity) {
            throw new NotAcceptableException('Reduction quantity is greater than number of item available')
        }
        this.itemRepository.save({
            ...item,
            quantityAvailable: item.quantityAvailable - quantity
        })
    }

}   