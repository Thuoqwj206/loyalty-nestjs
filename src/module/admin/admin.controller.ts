import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Admin } from "src/model/admin.model";
import { LoginAdminDTO } from "./dtos/login-admin.dto";
import { Roles } from "src/decorator/role.decorator";
import { RolesGuard } from "src/common/guard/role.guard";
import { ERole } from "src/enum";
import { CreateUserDTO, UpdateUserDTO } from "../user/dtos";
import { RegisterStoreDTO } from "../store/dtos/register-store.dto";
import { UpdateStoreDTO } from "../store/dtos/update-store.dto";


@Controller('admin')
export class AdminsController {
    constructor(private readonly adminService: AdminService) { }
    @Post()
    async register(@Body() body: Admin) {
        return this.adminService.create(body);
    }

    @Post('/login')
    async login(@Body() body: LoginAdminDTO) {
        return this.adminService.login(body);
    }

    @Get('/users')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async getAllUser() {
        return this.adminService.getAllUser()
    }

    @Post('/users')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async createUser(@Body() body: CreateUserDTO) {
        return this.adminService.createUser(body);
    }

    @Put('/users/:id')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async updateUser(@Param('id') id: number, @Body() body: UpdateUserDTO) {
        return this.adminService.updateUser(body, id);
    }

    @Delete('/users/:id')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async deleteUser(@Param('id') id: number) {
        return this.adminService.deleteUser(id);
    }

    @Get('/stores')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async getAllStore() {
        return this.adminService.getAllStore()
    }

    @Post('/stores')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async create(@Body() body: RegisterStoreDTO) {
        return this.adminService.createStore(body);
    }

    @Put('/stores/:id')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async update(@Body() body: UpdateStoreDTO, @Param('id') id: number) {
        return this.adminService.updateStore(body, id);
    }


    @Delete('/stores/:id')
    @Roles(ERole.ADMIN)
    @UseGuards(RolesGuard)
    async delete(@Param('id') id: number) {
        return this.adminService.deleteStore(id);
    }
}