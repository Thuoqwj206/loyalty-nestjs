import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/model/admin.model';
import { Repository } from 'typeorm';
import { LoginAdminDTO } from './dtos/login-admin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ERole } from 'src/enum';
import { StoreService } from '../store/store.service';
import { CreateUserDTO, UpdateUserDTO } from '../user/dtos';
import { Store, User } from 'src/model';
import { RegisterStoreDTO } from '../store/dtos/register-store.dto';
import { UpdateStoreDTO } from '../store/dtos/update-store.dto';


@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private adminsRepository: Repository<Admin>,
        private jwtService: JwtService,
        private readonly userService: UserService,
        private readonly storeService: StoreService
    ) { }

    async create(Body: Admin): Promise<Admin> {
        const salt = await bcrypt?.genSalt(10)
        Body.password = await bcrypt?.hash(Body.password, salt)
        const newAdmin = await this.adminsRepository.create(Body)
        await this.adminsRepository.save(newAdmin)
        return newAdmin
    }

    async login(body: LoginAdminDTO): Promise<{ admin: Admin, accessToken: string }> {
        const existedAdmin = await this.findByEmail(body.email)
        if (!existedAdmin) {
            throw new NotFoundException('Not found Admin Email')
        }
        if (!await bcrypt.compare(body.password, existedAdmin.password)) {
            throw new NotFoundException('Wrong password')
        }
        const admin = await this.adminsRepository.findOne({ where: { id: existedAdmin.id }, select: ['name', 'email'] })
        const accessToken = await this.generateToken(existedAdmin)
        return { admin, accessToken }
    }

    async findByEmail(email: string): Promise<Admin> {
        return this.adminsRepository.findOne({ where: { email } })
    }

    async generateToken(admin: Admin) {
        const payload = { id: admin?.id, email: admin?.email, role: ERole.ADMIN }
        return this.jwtService.signAsync(payload)
    }

    async createUser(body: CreateUserDTO): Promise<User> {
        return this.userService.createUserAdmin(body)
    }

    async getAllUser(): Promise<User[]> {
        return this.userService.findAll()
    }

    async updateUser(body: UpdateUserDTO, id: number): Promise<User> {
        return this.userService.updateUser(body, id)
    }

    async deleteUser(id: number): Promise<{ message: string }> {
        return this.userService.deleteUser(id)
    }

    async createStore(body: RegisterStoreDTO): Promise<Store> {
        return this.storeService.create(body)
    }

    async getAllStore(): Promise<Store[]> {
        return this.storeService.findAll()
    }

    async updateStore(body: UpdateStoreDTO, id: number): Promise<Store> {
        return this.storeService.update(body, id)
    }

    async deleteStore(id: number): Promise<{ message: string }> {
        return this.storeService.delete(id)
    }
}