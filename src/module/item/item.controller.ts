import { Body, Controller, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guard/role.guard";
import { currentStore } from "src/decorator/current-store.decorator";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum";
import { CreateItemDTO } from "./dtos";
import { ItemService } from "./item.service";

@Controller('/item')
export class ItemController {
    constructor(private readonly itemService: ItemService) { }

    @Get()
    async findAll() {
        return await this.itemService.findAll()
    }

    @Get('/:id')
    async findStoreItem(@Query('id') id: number) {
        return await this.itemService.findStoreItem(id)
    }

    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Post()
    async createItem(@Body() body: CreateItemDTO, @currentStore() store) {
        return await this.itemService.addNewItem(body, store)

    }

    @Put('/:id/add-quantity')
    async addQuantity(@Query('id') id: number, quantity: number) {
        return await this.addQuantity(id, quantity)
    }

    @Put('/:id/reduce-quantity')
    async reduceQuantity(@Query('id') id: number, quantity: number) {
        return await this.reduceQuantity(id, quantity)
    }
}