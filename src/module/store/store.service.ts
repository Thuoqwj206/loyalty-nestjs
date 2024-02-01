import { BadRequestException, Body, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ERole } from 'src/enum/role.enum';
import { MailService } from 'src/mail/mail.service';
import { Store } from 'src/model/store.model';
import { User } from 'src/model/user.model';
import { Repository } from 'typeorm';
import { LoginStoreDTO } from './dtos/login-store.dto';
import { RegisterStoreDTO } from './dtos/register-store.dto';
import { EStatus } from 'src/enum';
import { STORE_MESSAGES } from 'src/constant/messages';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserService } from '../user/user.service';
import { ReturnUserDTO } from '../user/dtos/return-user.dto';
import { UpdateStoreDTO } from './dtos/update-store.dto';

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(Store)
        private storesRepository: Repository<Store>,
        private readonly userService: UserService,
        private readonly mailService: MailService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly jwtService: JwtService
    ) { }

    async findAll(): Promise<Store[]> {
        const stores = await this.storesRepository.find();
        if (stores) {
            return stores
        }
    }

    async findCurrentStoreUser(store: Store): Promise<ReturnUserDTO[]> {
        const targetStore = await this.storesRepository.findOne({ where: { id: store.id } })
        return await this.userService.findStoreUsers(targetStore)
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
            throw new NotFoundException(STORE_MESSAGES.NOT_FOUND_STORE_EMAIL)
        }
        if (!await bcrypt.compare(store.password, existedStore.password)) {
            throw new NotFoundException(STORE_MESSAGES.WRONG_PASSWORD)
        }
        const hashed = await bcrypt.hash(existedStore.email, 10)
        this.mailService.sendRequestAdminConfirm(existedStore, hashed)
    }


    async create(Body: RegisterStoreDTO) {
        const store = await this.findByEmail(Body.email)
        if (store) {
            throw new BadRequestException(STORE_MESSAGES.STORE_ALREADY_EXISTED)
        }
        const salt = await bcrypt?.genSalt(10)
        const hashedPassword = await bcrypt?.hash(Body.password, salt)
        Body.password = hashedPassword
        const newStore = await this.storesRepository.create(Body)
        return await this.storesRepository.save(newStore)
    }

    async update(Body: UpdateStoreDTO, id: number) {
        const store = await this.storesRepository.findOne({ where: { id } })
        if (!store) {
            throw new BadRequestException(STORE_MESSAGES.STORE_NOT_FOUND)
        }
        if (Body.password) {
            const salt = await bcrypt?.genSalt(10)
            const hashedPassword = await bcrypt?.hash(Body.password, salt)
            Body.password = hashedPassword
        }
        return await this.storesRepository.save({
            ...store,
            ...Body
        })
    }

    async delete(id: number) {
        const store = await this.storesRepository.findOne({ where: { id } })
        if (!store) {
            throw new NotFoundException(STORE_MESSAGES.STORE_NOT_FOUND)
        }
        await this.storesRepository.remove(store)
        return STORE_MESSAGES.DELETED
    }


    async logout(store: Store) {
        if (!store) {
            throw new NotFoundException(STORE_MESSAGES.STORE_NOT_FOUND)
        }
        await this.cacheManager.set()
        this.storesRepository.save({
            ...store,
            status: EStatus.INVALIDATED
        })
    }

    async register(@Body() Body: RegisterStoreDTO) {
        const store = await this.findByName(Body.name)
        if (store) {
            throw new BadRequestException(STORE_MESSAGES.STORE_ALREADY_EXISTED)
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
            const returnStore = {
                name: updateStore.name,
                phone: updateStore.phone,
                email: updateStore.email
            }
            await this.storesRepository.save(updateStore)
            return returnStore
        }
        else {
            throw new NotFoundException(STORE_MESSAGES.PLEASE_RECHECK_EMAIL)
        }
    }

    async confirmStore(email: string, token: string) {
        const isConfirm = await bcrypt.compare(email, token)
        if (isConfirm) {
            const store = await this.findByEmail(email)
            const updateStore = {
                ...store,
                status: EStatus.VALIDATED
            } as Store
            this.storesRepository.save(updateStore)
            const returnStore = {
                name: updateStore.name,
                phone: updateStore.phone,
                email: updateStore.email
            }
            const accessToken = await this.generateToken(updateStore)
            return { returnStore, accessToken }
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
        const payload = { id: store?.id, email: store?.email, role: ERole.STORE }
        return await this.jwtService.signAsync(payload)
    }
}

