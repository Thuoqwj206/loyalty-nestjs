import { BadRequestException, Body, Injectable, NotFoundException, Param, Redirect } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status, Store } from 'src/model/store.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { MailService } from 'src/mail/mail.service';
import { RegisterStoreDTO } from './dtos/register-store.dto';
import { User } from 'src/model/user.model';

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(Store)
        private storesRepository: Repository<Store>,
        private readonly mailService: MailService
    ) { }

    async findAll(): Promise<Store[]> {
        const stores = await this.storesRepository.find();
        if (stores) {
            return stores
        }
    }
    async getAllUser(store: Store): Promise<User[]> {
        if (!store.users) {
            throw new NotFoundException()
        }
        return store.users
    }

    async create(@Body() Body: RegisterStoreDTO) {
        const store = await this.findByName(Body.name)
        if (store) {
            throw new BadRequestException('Store already existed')
        }
        const salt = await bcrypt?.genSalt(10)
        const hashedPassword = await bcrypt?.hash(Body.password, salt)
        Body.password = hashedPassword
        const newStore = await this.storesRepository.create(Body)
        await this.storesRepository.save(newStore)
        const token = await bcrypt?.hash(newStore.email, salt)
        this.mailService.sendStoreConfirmationEmail(newStore, token)

    }

    async verifyEmail(email: string, token: string) {
        const isConfirm = await bcrypt.compare(email, token)
        if (isConfirm) {
            const store = await this.findByEmail(email)
            const hashed = await bcrypt.hash(email, 10)
            const currentDate = new Date(Date.now())
            const updateStore = {
                ...store,
                email_verified_at: currentDate
            }
            this.storesRepository.save(updateStore)
            this.mailService.sendRequestAdminConfirm(store, hashed)
        }
        else {
            throw new NotFoundException('Please recheck your email')
        }
    }

    async confirmStore(email: string, token: string) {
        const isConfirm = await bcrypt.compare(email, token)
        if (isConfirm) {
            const store = await this.findByEmail(email)
            const updateStore = {
                ...store,
                status: Status.VALIDATED
            }
            return this.storesRepository.save(updateStore)
        }
    }

    async findByName(name: string): Promise<Store> {
        const store = await this.storesRepository.findOne({ where: { name } })
        if (store) {
            return store
        }
        else {
        }
    }

    async findByEmail(email: string): Promise<Store> {
        const store = await this.storesRepository.findOne({ where: { email } })
        if (store) {
            return store
        }
        else {
            throw new NotFoundException()
        }
    }

    async findOne(id: number): Promise<{ store?: Store, isSuccess: boolean }> {
        const store = await this.storesRepository.findOne({ where: { id: id } })
        if (!store) {
            return { isSuccess: false }
        }
        return { store, isSuccess: true }
    }
    async remove(id: number): Promise<void> {
        await this.storesRepository.delete(id);
    }

    async addUser(user: User, store: Store) {
        await store.users.push(user)
    }


}

