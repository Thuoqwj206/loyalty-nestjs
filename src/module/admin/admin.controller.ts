import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Admin } from "src/model/admin.model";


@Controller('admin')
export class AdminsController {
    constructor(private readonly adminService: AdminService) { }
    @Get()
    async getAll() {
        return this.adminService.findAll()
    }

    @Post()
    async register(@Body() body: Admin) {
        const newAdmin = await this.adminService.create(body);
        return newAdmin;
    }
}