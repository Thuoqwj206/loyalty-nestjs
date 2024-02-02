import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { TwilioService } from 'nestjs-twilio';
import { STORE_MESSAGES, USER_MESSAGES } from 'src/constant/messages';
import { ERank, ERole } from 'src/enum';
import { Store } from 'src/model/store.model';
import { User } from 'src/model/user.model';
import { RedisService } from 'src/services/redis/redis.service';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { RegisterUserDTO, OTPConfirmDTO, LoginUserDTO, CreateUserDTO, UpdateUserDTO } from './dtos';
import Twilio from 'twilio/lib/rest/Twilio';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly redisService: RedisService,
        private readonly twilioService: TwilioService,
        private readonly jwtService: JwtService,

    ) { }
    async findAll(): Promise<User[]> {
        return this.usersRepository.find({ select: ['name', 'email', 'phone'] });
    }
    async findStoreUsers(store: Store): Promise<User[]> {
        return this.usersRepository.find({ where: { store }, select: ['name', 'email', 'phone'] })
    }

    async create(body: RegisterUserDTO): Promise<{ message: string }> {
        const user = await this.findByPhone(body.phone)
        if (user) {
            throw new BadRequestException(USER_MESSAGES.USER_ALREADY_EXISTS)
        }
        const salt = await bcrypt?.genSalt(10)
        body.password = await bcrypt?.hash(body.password, salt)
        const otp = Math.floor(100000 + Math.random() * 900000) as unknown as string;
        const newUser = await this.usersRepository.create(body)
        await this.usersRepository.save(newUser)
        await this.redisService.setExpire(newUser.phone, otp, 60000)
        await this.sendSMS(otp, newUser.phone)
        await this.redisService.setExpire(otp, 1, 30000)
        return { message: USER_MESSAGES.SENT_OTP }
    }


    async sendSMS(otp: string, number: string): Promise<Twilio.RequestOptions> {
        return this.twilioService.client.messages.create({
            body: USER_MESSAGES.RECEIVE_OTP + otp,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: number,
        });
    }
    async confirmRegisterOTP(body: OTPConfirmDTO) {
        const user = await this.findByPhone(body.phone)
        if (!user || user.verified_at) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        const storedOTP = await this.redisService.get(user.phone)
        if (storedOTP == body.otp) {
            const newUser = {
                ...user,
                verified_at: new Date(),
            } as User
            await this.usersRepository.save(newUser)
            await this.redisService.del(String(storedOTP))
            await this.redisService.del(newUser?.phone)
            const returnUser = await this.usersRepository.findOne({ where: { id: newUser.id } })
            return { returnUser, isSuccess: true }
        }
        else {
            const currentTry: number = JSON.parse(await this.redisService.get(storedOTP))
            await this.redisService.setExpire(String(storedOTP), currentTry + 1, 600000)
            const result = Number(await this.redisService.get(storedOTP))
            if (result > 3) {
                await this.usersRepository.delete(user.id)
                return { isSuccess: false }
            }
            else { return { message: String(USER_MESSAGES.ATTEMPT_TIME(Number(currentTry))) } }
        }
    }


    async login(user: LoginUserDTO): Promise<{ message: string }> {
        const existedUser = await this.findByPhone(user.phone)
        if (!existedUser) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        if (!await bcrypt.compare(user.password, existedUser.password)) {
            throw new NotFoundException(STORE_MESSAGES.WRONG_PASSWORD)
        }
        const otp = Math.floor(100000 + Math.random() * 900000) as unknown as string;
        await this.redisService.setExpire(String(existedUser.id), otp, 60000)
        await this.sendSMS(otp, existedUser.phone)
        return { message: USER_MESSAGES.SENT_OTP }
    }

    async confirmLoginOTP(body: OTPConfirmDTO): Promise<{ ReturnUserDTO: any, accessToken: string } | { message: string }> {
        const user = await this.findByPhone(body.phone)
        const storedOTP = await this.redisService.get(String(user.id))
        if (storedOTP == body.otp) {
            const ReturnUserDTO = await this.usersRepository.find({ where: { id: user.id }, select: ['name', 'email', 'phone'] })
            const accessToken = await this.generateToken(user)
            await this.redisService.setExpire(JSON.stringify(user.id), accessToken, 43200000)
            await this.redisService.del(String(storedOTP))
            return { ReturnUserDTO, accessToken }
        }
        else {
            const currentTry: number = JSON.parse(await this.redisService.get(storedOTP))
            await this.redisService.setExpire(String(storedOTP), currentTry + 1, 600000)
            const result = JSON.parse(await this.redisService.get(storedOTP))
            if (result > 3) {
                throw new NotFoundException(USER_MESSAGES.DEAD_OTP)
            }
            else { return { message: String(USER_MESSAGES.ATTEMPT_TIME(Number(currentTry))) } }
        }
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { email } })
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        return user
    }

    async findByPhone(phone: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { phone } })
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        return user
    }

    async findById(id: number): Promise<User> {
        return this.usersRepository.findOne({ where: { id } })
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: id }, select: ['name', 'email', 'phone'] })
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        return user
    }

    async reducePoint(id: number, point: number): Promise<{ user: User, newPoint: number }> {
        const user = await this.usersRepository.findOne({ where: { id: id } })
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        const newPoint = user.point - point
        return { user, newPoint }
    }


    async addPoint(id: number, point: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: id } })
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        return this.usersRepository.save({
            ...user,
            point: user.point + point
        })
    }

    async accumulatePoint(user: User, price: number): Promise<{ user: User, point: number }> {
        let point = user.point
        point += (price - (price % 100000)) / 1000
        let bonus = 0
        if (price < 100000) {
            bonus = Math.floor(price * 0.1)
            if (bonus > 5000) {
                bonus = 5000
            }
        }
        else if (100000 < price) {
            bonus = Math.floor(price * 0.2)
            if (bonus > 10000) {
                bonus = 10000
            }
        }

        switch (user.Rank) {
            case ERank.BRONZE: {
                this.handleUpperRank(user, point, bonus, price, this.rankDiff.BRONZE)
                break
            }
            case ERank.SILVER: {
                this.handleUpperRank(user, point, bonus, price, this.rankDiff.SILVER)
                break
            }
            case ERank.GOLD: {
                this.handleUpperRank(user, point, bonus, price, this.rankDiff.GOLD)
                break
            }
        }
        return { user, point }
    }
    rankDiff = {
        'BRONZE': 5,
        'SILVER': 10,
        'GOLD': 15
    }

    async handleUpperRank(user: User, point: number, bonus: number, price: number, addedPoint: number) {
        bonus += ((price - (price % 100000)) / 100000) * addedPoint
        point += bonus
        if (point >= 2000 && point < 5000 && user.Rank == ERank.BRONZE) {
            user.Rank = ERank.SILVER
        }
        else if (point >= 5000) {
            user.Rank = ERank.GOLD
        }
    }

    async isUserInStore(id: number, store: Store): Promise<boolean> {
        const user = await this.usersRepository.findOne({ where: { id }, relations: ['store'] })
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        if (user.store.id !== store.id) {
            return false
        } else { return true }
    }

    async createUserAdmin(body: CreateUserDTO): Promise<User> {
        const user = await this.findByPhone(body.phone)
        if (user) {
            throw new BadRequestException(USER_MESSAGES.USER_ALREADY_EXISTS)
        }
        const salt = await bcrypt?.genSalt(10)
        body.password = await bcrypt?.hash(body.password, salt)
        const newUser = this.usersRepository.create(body)
        await this.usersRepository.save({
            ...newUser,
            verified_at: new Date(),
        })
        return this.usersRepository.findOne({ where: { id: user?.id }, select: ['name', 'email', 'phone'] })
    }
    async updateUserStore(user: User, store: Store): Promise<User> {
        await this.usersRepository.save({
            ...user,
            store: store
        })
        return this.usersRepository.findOne({ where: { id: user.id }, select: ['name', 'email', 'phone'] })
    }

    async updateUser(body: UpdateUserDTO, id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        if (body.password) {
            const salt = await bcrypt.genSalt(10)
            body.password = await bcrypt.hash(body.password, salt)
        }
        await this.usersRepository.save({
            ...user,
            ...body
        })
        return this.usersRepository.findOne({ where: { id: user.id }, select: ['name', 'email', 'phone'] })
    }

    async deleteUser(id: number): Promise<{ message: string }> {
        const user = await this.usersRepository.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        await this.usersRepository.remove(user)
        return { message: USER_MESSAGES.DELETED }
    }

    async logout(user: User): Promise<{ message: string }> {
        if (!user) {
            throw new NotFoundException()
        }
        const token = await this.redisService.get(String(user.id))
        await this.redisService.setExpire(token, 1, 432000)
        return { message: USER_MESSAGES.LOGOUT }
    }

    async generateToken(user: User): Promise<string> {
        const payload = { id: user?.id, email: user?.email, role: ERole.USER }
        return this.jwtService.signAsync(payload)
    }
}

