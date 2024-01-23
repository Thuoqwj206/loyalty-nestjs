import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/model/admin.model';
import { Repository } from 'typeorm';


@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private adminsRepository: Repository<Admin>,
    ) { }

    async findAll(): Promise<Admin[]> {
        const admins = await this.adminsRepository.find();
        if (admins) {
            return admins
        }
    }

    async create(Body: Admin): Promise<Admin> {
        const newAdmin = await this.adminsRepository.create(Body)
        await this.adminsRepository.save(newAdmin)
        return newAdmin
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


}