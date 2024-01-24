import { BadRequestException, Body, Inject, Injectable, NotFoundException, Request, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { Status, Store } from 'src/model/store.model';
import { User } from 'src/model/user.model';
import { Repository } from 'typeorm';
import { LoginStoreDTO } from './dtos/login-store.dto';
import { RegisterStoreDTO } from './dtos/register-store.dto';
import { request } from 'http';
import { ERole } from 'src/enum/role.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(Store)
        private storesRepository: Repository<Store>,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService
    ) { }

    async findAll(): Promise<Store[]> {
        const stores = await this.storesRepository.find();
        if (stores) {
            return stores
        }
    }
    async getAllUser(store: Store): Promise<User[]> {
        if (!store?.users) {
            throw new NotFoundException()
        }
        return store?.users
    }
    async login(store: LoginStoreDTO) {
        const existedStore = await this.findByEmail(store.email)
        if (!existedStore) {
            throw new NotFoundException('Not found Store Email')
        }
        if (!await bcrypt.compare(store.password, existedStore.password)) {
            throw new NotFoundException('Wrong password')
        }
        const hashed = await bcrypt.hash(existedStore.email, 10)
        this.mailService.sendRequestAdminConfirm(existedStore, hashed)
    }

    async logout(store: any) {
        if (!store) {
            throw new NotFoundException()
        }
        this.storesRepository.save({
            ...store,
            status: Status.INVALIDATED
        })
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
            const currentDate = new Date(Date.now())
            const updateStore = {
                ...store,
                email_verified_at: currentDate
            }
            this.storesRepository.save(updateStore)
            return this.storesRepository.save(updateStore)
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
            } as Store
            this.storesRepository.save(updateStore)

            const accessToken = await this.generateToken(updateStore)
            return { updateStore, accessToken }
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

    async findOne(id: number): Promise<Store> {
        const store = await this.storesRepository.findOne({ where: { id: id } })
        if (!store) {

        }
        return store
    }
    async remove(id: number): Promise<void> {
        await this.storesRepository.delete(id);
    }

    async addUser(user: User, store: Store) {
        await store.users?.push(user)
    }

    async generateToken(store: Store) {
        const payload = { id: store?.id, email: store?.email, role: ERole.Store }
        return await this.jwtService.signAsync(payload)
    }
}

