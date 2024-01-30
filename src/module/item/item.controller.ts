import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guard/role.guard";
import { currentStore } from "src/decorator/current-store.decorator";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum";
import { CreateItemDTO } from "./dtos";
import { ItemService } from "./item.service";
import { Store } from "src/model";
import { UpdateItemDTO } from "./dtos/update-item.dto";

@Controller('/item')
export class ItemController {
    constructor(private readonly itemService: ItemService) { }

    @Get()
    async findAll() {
        return await this.itemService.findAll()
    }

    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Get()
    async findStoreItem(@currentStore() store: Store) {
        return await this.itemService.findStoreItem(store)
    }

    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Post()
    async createItem(@Body() body: CreateItemDTO, @currentStore() store) {
        return await this.itemService.addNewItem(body, store)

    }

    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Put('update/:id')
    async update(@Body() body: UpdateItemDTO, @Param('id') id: number) {
        return await this.itemService.update(body, id)
    }

    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Put('/:id/add-quantity')
    async addQuantity(@Query('id') id: number, quantity: number) {
        return await this.addQuantity(id, quantity)
    }

    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Put('/:id/reduce-quantity')
    async reduceQuantity(@Query('id') id: number, quantity: number) {
        return await this.reduceQuantity(id, quantity)
    }

    @Roles(ERole.STORE)
    @UseGuards(RolesGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: number) {
        return await this.itemService.delete(id)
    }
}