// import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Gift, Store } from "src/model";
// import { Repository } from "typeorm";
// import { StoreService } from "../store/store.service";
// import { CreateGiftDTO } from "./dtos";

// @Injectable()
// export class GiftService {
//     constructor(
//         @InjectRepository(Gift)
//         private itemRepository: Repository<Gift>,
//         private readonly storeService: StoreService
//     ) { }

//     async findAll(): Promise<Gift[]> {
//         const items = await this.itemRepository.find();
//         if (items) {
//             return items
//         }
//         return null
//     }

//     async findOne(id: number): Promise<Gift> {
//         const item = await this.itemRepository.findOne({ where: { id } });
//         if (item) {
//             return item
//         }
//         return null
//     }

//     async findStoreGift(id: number): Promise<Gift[]> {
//         const store = await this.storeService.findOne(id)
//         const items = await this.itemRepository.find({ where: { store } })
//         if (items) {
//             return items
//         }
//         return null
//     }

//     async addNewGift(body: CreateGiftDTO, store) {
//         const { name } = body
//         const item = await this.itemRepository.findOne({ where: { name } })
//         if (item) {
//             throw new NotAcceptableException('Existed Gift Name')
//         }
//         const targetStore = await this.storeService.findOne(store?.id)
//         const newGift = await this.itemRepository.create(body)
//         await this.itemRepository.save({
//             ...newGift,
//             store: targetStore
//         })
//         return newGift
//     }

//     async addQuantity(id: number, quantity: number) {
//         const item = await this.itemRepository.findOne({ where: { id } })
//         if (!item) {
//             throw new NotFoundException('Not found any item')
//         }
//         this.itemRepository.save({
//             ...item,
//             quantityAvailable: item.quantityAvailable + quantity
//         })
//     }

//     async reduceQuantity(id: number, quantity: number) {
//         const item = await this.itemRepository.findOne({ where: { id } })
//         if (!item) {
//             throw new NotFoundException('Not found any item')
//         }
//         if (item.quantityAvailable < quantity) {
//             throw new NotAcceptableException('Reduction quantity is greater than number of item available')
//         }
//         this.itemRepository.save({
//             ...item,
//             quantityAvailable: item.quantityAvailable - quantity
//         })
//     }

// }   