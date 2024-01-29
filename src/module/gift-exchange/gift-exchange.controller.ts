import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { GiftExchangeService } from "./gift-exchange.service";
import { CreateGiftExchangeDTO } from "./dtos";

@Controller('/order-item')
export class GiftExchangeController {
    constructor(private readonly orderItemService: GiftExchangeService) { }

    @Get()
    async findAll() {
        return await this.orderItemService.findAll()
    }
}