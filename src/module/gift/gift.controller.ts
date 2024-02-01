import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guard/role.guard";
import { currentStore } from "src/decorator/current-store.decorator";
import { Roles } from "src/decorator/role.decorator";
import { ERole } from "src/enum";
import { CreateGiftDTO } from "./dtos";
import { GiftService } from "./gift.service";

@Controller('/gift')
export class GiftController {
    constructor(private readonly giftService: GiftService) { }

}