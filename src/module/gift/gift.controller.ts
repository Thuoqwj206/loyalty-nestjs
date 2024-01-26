// import { Body, Controller, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
// import { RolesGuard } from "src/common/guard/role.guard";
// import { currentStore } from "src/decorator/current-store.decorator";
// import { Roles } from "src/decorator/role.decorator";
// import { ERole } from "src/enum";
// import { CreateGiftDTO } from "./dtos";
// import { GiftService } from "./gift.service";

// @Controller('/item')
// export class GiftController {
//     constructor(private readonly itemService: GiftService) { }

//     @Get()
//     async findAll() {
//         return await this.itemService.findAll()
//     }

//     @Get('/:id')
//     async findStoreGift(@Query('id') id: number) {
//         return await this.itemService.findStoreGift(id)
//     }

//     @Roles(ERole.STORE)
//     @UseGuards(RolesGuard)
//     @Post()
//     async createGift(@Body() body: CreateGiftDTO, @currentStore() store) {
//         return await this.itemService.addNewGift(body, store)

//     }

//     @Put('/:id/add-quantity')
//     async addQuantity(@Query('id') id: number, quantity: number) {
//         return await this.addQuantity(id, quantity)
//     }

//     @Put('/:id/reduce-quantity')
//     async reduceQuantity(@Query('id') id: number, quantity: number) {
//         return await this.reduceQuantity(id, quantity)
//     }
// }