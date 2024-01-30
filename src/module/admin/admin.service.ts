import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/model/admin.model';
import { Repository } from 'typeorm';
import { LoginAdminDTO } from './dtos/login-admin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ERole } from 'src/enum';


@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private adminsRepository: Repository<Admin>,
        private jwtService: JwtService
    ) { }

    async findAll(): Promise<Admin[]> {
        const admins = await this.adminsRepository.find();
        if (admins) {
            return admins
        }
    }

    async create(Body: Admin): Promise<Admin> {
        const salt = await bcrypt?.genSalt(10)
        Body.password = await bcrypt?.hash(Body.password, salt)
        const newAdmin = await this.adminsRepository.create(Body)
        await this.adminsRepository.save(newAdmin)
        return newAdmin
    }

    async login(admin: LoginAdminDTO): Promise<{ existedAdmin: Admin, accessToken: string }> {
        const existedAdmin = await this.findByEmail(admin.email)
        if (!existedAdmin) {
            throw new NotFoundException('Not found Admin Email')
        }
        if (!await bcrypt.compare(admin.password, existedAdmin.password)) {
            throw new NotFoundException('Wrong password')
        }
        const accessToken = await this.generateToken(existedAdmin)
        return { existedAdmin, accessToken }
    }

    async findByEmail(email: string): Promise<Admin> {
        const store = await this.adminsRepository.findOne({ where: { email } })
        if (store) {
            return store
        }
        else {
            throw new NotFoundException()
        }
    }

    async findByName(name: string): Promise<Admin> {
        const admin = await this.adminsRepository.findOne({ where: { name } })
        if (admin) {
            return admin
        }
        else {
        }
    }

    async findOne(id: number): Promise<{ admin?: Admin, isSuccess: boolean }> {
        const admin = await this.adminsRepository.findOne({ where: { id: id } })
        if (!admin) {
            return { isSuccess: false }
        }
        return { admin, isSuccess: true }
    }


    async remove(id: number): Promise<void> {
        await this.adminsRepository.delete(id);
    }

    async generateToken(admin: Admin) {
        const payload = { id: admin?.id, email: admin?.email, role: ERole.ADMIN }
        return await this.jwtService.signAsync(payload)
    }
}