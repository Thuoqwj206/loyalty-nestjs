import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { STORE_CONSTANTS, USER_CONSTANTS } from 'src/constant';
import { STORE_MESSAGES, USER_MESSAGES } from 'src/constant/messages';
import { EStatus } from 'src/enum';
import { ERole } from 'src/enum/role.enum';
import { EFormula } from 'src/enum/store-enum/rank-formula.enum';
import { MailService } from 'src/mail/mail.service';
import { Gift, Item } from 'src/model';
import { Store } from 'src/model/store.model';
import { User } from 'src/model/user.model';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { RedisService } from 'src/services/redis/redis.service';
import { Repository } from 'typeorm';
import { CreateGiftDTO } from '../gift/dtos';
import { UpdateGiftDTO } from '../gift/dtos/update-gift.dto';
import { GiftService } from '../gift/gift.service';
import { CreateItemDTO } from '../item/dtos';
import { UpdateItemDTO } from '../item/dtos/update-item.dto';
import { ItemService } from '../item/item.service';
import { OTPConfirmDTO, UpdateUserDTO } from '../user/dtos';
import { AddUserPointDTO } from '../user/dtos/add-point.dto';
import { UserService } from '../user/user.service';
import { LoginStoreDTO } from './dtos/login-store.dto';
import { RegisterStoreDTO } from './dtos/register-store.dto';
import { UpdateStoreDTO } from './dtos/update-store.dto';

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(Store)
        private storesRepository: Repository<Store>,
        private readonly userService: UserService,
        private readonly redisService: RedisService,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService,
        private readonly itemService: ItemService,
        private readonly giftService: GiftService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async findAll(): Promise<Store[]> {
        return this.storesRepository.find({ select: ['name', 'email', 'phone'] });
    }

    async findCurrentStoreUser(store: Store): Promise<User[]> {
        const targetStore = await this.storesRepository.findOne({ where: { id: store.id } })
        return this.userService.findStoreUsers(targetStore)

    }

    async updateCurrentStoreUser(store: Store, body: UpdateUserDTO, id: number): Promise<User> {
        const currentStore = await this.storesRepository.findOne({ where: { id: store.id } })
        if (await this.userService.isUserInStore(id, currentStore) == false) {
            throw new NotAcceptableException(STORE_MESSAGES.USER_NOT_BELONG)
        }
        return this.userService.updateUser(body, id)
    }

    async deleteCurrentStoreUser(store: Store, id: number): Promise<{ message: string }> {
        const currentStore = await this.storesRepository.findOne({ where: { id: store.id } })
        if (await this.userService.isUserInStore(id, currentStore) == false) {
            throw new NotAcceptableException(STORE_MESSAGES.USER_NOT_BELONG)
        }
        return this.userService.deleteUser(id)
    }

    async addCurrentUserPoint(store: Store, body: AddUserPointDTO, id: number): Promise<User> {
        const currentStore = await this.storesRepository.findOne({ where: { id: store.id } })
        if (await this.userService.isUserInStore(id, currentStore) == false) {
            throw new NotAcceptableException(STORE_MESSAGES.USER_NOT_BELONG)
        }
        return this.userService.addPoint(id, body.point)
    }

    async addStoreItem(store: Store, body: CreateItemDTO, file: Express.Multer.File): Promise<Item> {
        const img = await this.uploadImageToCloudinary(file)
        return this.itemService.addNewItem(body, store, img.url)
    }

    async findCurrentStoreItem(store: Store): Promise<Item[]> {
        const targetStore = await this.storesRepository.findOne({ where: { id: store.id } })
        return this.itemService.findStoreItem(targetStore)
    }

    async updateCurrentStoreItem(store: Store, body: UpdateItemDTO, id: number, file: Express.Multer.File): Promise<Item> {
        const currentStore = await this.storesRepository.findOne({ where: { id: store.id } })
        if (await this.itemService.isItemInStore(id, currentStore) == false) {
            throw new NotAcceptableException(STORE_MESSAGES.USER_NOT_BELONG)
        }
        return this.itemService.update(body, id, file)
    }

    async deleteCurrentStoreItem(store: Store, id: number): Promise<{ message: string }> {
        const currentStore = await this.storesRepository.findOne({ where: { id: store.id } })
        if (await this.itemService.isItemInStore(id, currentStore) == false) {
            throw new NotAcceptableException(STORE_MESSAGES.USER_NOT_BELONG)
        }
        return this.itemService.delete(id)
    }

    async addStoreGift(store: Store, body: CreateGiftDTO, file: Express.Multer.File): Promise<Gift> {
        const img = await this.uploadImageToCloudinary(file)
        return this.giftService.addNewGift(body, store, img.url)
    }

    async findCurrentStoreGift(store: Store): Promise<Gift[]> {
        const targetStore = await this.storesRepository.findOne({ where: { id: store.id } })
        return this.giftService.findStoreGift(targetStore)
    }

    async findStoreAvailableGifts(id: number): Promise<Gift[]> {
        const store = await this.storesRepository.findOne({ where: { id } })
        if (!store) {
            throw new NotFoundException(STORE_MESSAGES.STORE_NOT_FOUND)
        }
        return this.giftService.findAvailableGifts(store)
    }

    async changeFormula(store: Store): Promise<Store> {
        const currentStore = await this.storesRepository.findOne({ where: { id: store.id } })
        if (currentStore.rankFormula === EFormula.LIMITATION) {
            currentStore.rankFormula = EFormula.PERCENTAGE
        }
        else currentStore.rankFormula = EFormula.LIMITATION
        await this.storesRepository.save({
            ...currentStore
        })
        return this.storesRepository.findOne({ where: { id: currentStore.id }, select: ['name', 'rankFormula'] })
    }


    async updateStoreGift(store: Store, body: UpdateGiftDTO, id: number, file: Express.Multer.File): Promise<Gift> {
        const currentStore = await this.storesRepository.findOne({ where: { id: store.id } })
        if (await this.giftService.isGiftInStore(id, currentStore) == false) {
            throw new NotAcceptableException(STORE_MESSAGES.USER_NOT_BELONG)
        }
        const img = await this.uploadImageToCloudinary(file)
        return this.giftService.update(body, id, img.url)
    }

    async deleteStoreGift(store: Store, id: number): Promise<{ message: string }> {
        const currentStore = await this.storesRepository.findOne({ where: { id: store.id } })
        if (await this.giftService.isGiftInStore(id, currentStore) == false) {
            throw new NotAcceptableException(STORE_MESSAGES.USER_NOT_BELONG)
        }
        return this.giftService.delete(id)
    }

    async userConfirmOTP(body: OTPConfirmDTO, store: Store): Promise<User | { message: string }> {
        const targetStore = await this.findByEmail(store.email)
        const user = await this.userService.findByPhone(body.phone)
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        const storedOTP = await this.redisService.get(user.phone)
        if (storedOTP == body.otp) {
            const newUser = {
                ...user,
                verified_at: new Date(),
                store: targetStore
            } as User
            await this.userService.saveUser(newUser)
            await this.redisService.del(String(storedOTP))
            await this.redisService.del(newUser?.phone)
            return this.userService.findById(newUser.id)
        }
        else {
            const currentTry: number = JSON.parse(await this.redisService.get(storedOTP))
            await this.redisService.setExpire(String(storedOTP), currentTry + 1, USER_CONSTANTS.OTP_EXPIRE_TIME)
            const result = JSON.parse(await this.redisService.get(storedOTP))
            if (result > 3) {
                await this.userService.deleteUser(user.id)
                return { message: USER_MESSAGES.NOT_FOUND }
            }
            else return { message: String(USER_MESSAGES.ATTEMPT_TIME(Number(currentTry))) }
        }
    }

    async login(store: LoginStoreDTO): Promise<{ store: Store, token: string }> {
        const existedStore = await this.findByEmail(store.email)
        if (!existedStore) {
            throw new NotFoundException(STORE_MESSAGES.NOT_FOUND_STORE_EMAIL)
        }
        if (!await bcrypt.compare(store.password, existedStore.password)) {
            throw new NotFoundException(STORE_MESSAGES.WRONG_PASSWORD)
        }
        if (!existedStore.email_verified_at) {
            throw new NotAcceptableException(STORE_MESSAGES.NOT_VERIFIED)
        }
        if (existedStore.status == EStatus.INVALIDATED) {
            throw new NotAcceptableException(STORE_MESSAGES.WAIT_FOR_ADMIN)
        }
        const token = await this.generateToken(existedStore)
        await this.redisService.setExpire(String(existedStore.id), token, STORE_CONSTANTS.LOGOUT_TOKEN_TIME)
        const returnStore = await this.storesRepository.findOne({ where: { id: existedStore.id }, select: ['name', 'email', 'phone'] })
        return { store: returnStore, token: token }
    }

    async create(body: RegisterStoreDTO): Promise<Store> {
        const store = await this.findByEmail(body.email)
        if (store) {
            throw new BadRequestException(STORE_MESSAGES.STORE_ALREADY_EXISTED)
        }
        const salt = await bcrypt?.genSalt(10)
        body.password = await bcrypt?.hash(body.password, salt)
        const newStore = await this.storesRepository.create(body) as Store
        await this.storesRepository.save({
            ...newStore,
            email_verified_at: new Date()
        })
        return this.storesRepository.findOne({ where: { email: newStore.email }, select: ['name', 'email', 'phone'] })
    }

    async update(body: UpdateStoreDTO, id: number): Promise<Store> {
        const store = await this.storesRepository.findOne({ where: { id } })
        if (!store) {
            throw new BadRequestException(STORE_MESSAGES.STORE_NOT_FOUND)
        }
        if (body.password) {
            const salt = await bcrypt?.genSalt(10)
            const hashedPassword = await bcrypt?.hash(body.password, salt)
            body.password = hashedPassword
        }
        const newStore = await this.storesRepository.save({
            ...store,
            ...body
        })
        return this.storesRepository.findOne({ where: { id: newStore.id }, select: ['name', 'email', 'phone'] })
    }

    async delete(id: number): Promise<{ message: string }> {
        const store = await this.storesRepository.findOne({ where: { id } })
        if (!store) {
            throw new NotFoundException(STORE_MESSAGES.STORE_NOT_FOUND)
        }
        const users = await this.userService.findStoreUsers(store)
        users.map(async (user) => {
            await this.userService.deleteUser(user.id)
        })
        await this.storesRepository.remove(store)
        return { message: STORE_MESSAGES.DELETED }
    }


    async logout(store: Store): Promise<{ message: string }> {
        if (!store) {
            throw new NotFoundException(STORE_MESSAGES.STORE_NOT_FOUND)
        }
        const token = await this.redisService.get(String(store.id))
        await this.redisService.setExpire(token, 1, STORE_CONSTANTS.LOGOUT_TOKEN_TIME)
        return { message: STORE_MESSAGES.LOGOUT }
    }

    async register(body: RegisterStoreDTO): Promise<{ message: string }> {
        const store = await this.findByEmail(body.email)
        const existedName = await this.findByName(body.name)
        if (store || existedName) {
            throw new BadRequestException(STORE_MESSAGES.STORE_ALREADY_EXISTED)
        }
        const salt = await bcrypt?.genSalt(10)
        const hashedPassword = await bcrypt?.hash(body.password, salt)
        body.password = hashedPassword
        const newStore = await this.storesRepository.create(body).save()
        const token = await bcrypt?.hash(newStore.email, salt)
        this.mailService.sendStoreConfirmationEmail(newStore, token)
        return { message: STORE_MESSAGES.SENT_EMAIL }
    }

    async verifyEmail(email: string, token: string): Promise<Store> {
        const isConfirm = await bcrypt.compare(email, token)
        if (isConfirm) {
            const store = await this.findByEmail(email)
            await this.storesRepository.save({
                ...store,
                email_verified_at: new Date()
            })
            this.mailService.sendRequestAdminConfirm(store, token)
            const returnStore = await this.storesRepository.findOne({ where: { id: store.id }, select: ['name', 'email', 'phone'] })
            return returnStore
        }
        else {
            throw new NotFoundException(STORE_MESSAGES.PLEASE_RECHECK_EMAIL)
        }
    }

    async confirmStore(email: string, token: string): Promise<{ message: string }> {
        const isConfirm = await bcrypt.compare(email, token)
        if (isConfirm) {
            const store = await this.findByEmail(email)
            this.storesRepository.save({
                ...store,
                status: EStatus.VALIDATED
            })

            return { message: STORE_MESSAGES.STORE_VALIDATED }
        }
    }


    async findByEmail(email: string): Promise<Store | null> {
        const store = await this.storesRepository.findOne({ where: { email } })
        if (store) {
            return store
        }
        return null
    }


    async findByName(name: string): Promise<Store | null> {
        const store = await this.storesRepository.findOne({ where: { name } })
        if (store) {
            return store
        }
        return null
    }

    async findOne(id: number): Promise<Store> {
        const store = await this.storesRepository.findOne({ where: { id: id } })
        if (!store) {
            throw new NotFoundException(STORE_MESSAGES.STORE_NOT_FOUND)
        }
        return store
    }
    async generateToken(store: Store): Promise<string> {
        const payload = { id: store?.id, email: store?.email, role: ERole.STORE }
        return this.jwtService.signAsync(payload)
    }

    async uploadImageToCloudinary(file: Express.Multer.File) {
        return this.cloudinaryService.uploadImage(file).catch(() => {
            throw new BadRequestException('Invalid file type.');
        });
    }
}

