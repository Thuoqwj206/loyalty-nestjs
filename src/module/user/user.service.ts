import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { TwilioService } from 'nestjs-twilio';
import { TWILIO_PHONE_NUMBER } from 'src/config';
import { USER_CONSTANTS } from 'src/constant';
import { STORE_MESSAGES, USER_MESSAGES } from 'src/constant/messages';
import { ERank, ERole } from 'src/enum';
import { EFormula } from 'src/enum/store-enum/rank-formula.enum';
import { Store } from 'src/model/store.model';
import { User } from 'src/model/user.model';
import { RedisService } from 'src/services/redis/redis.service';
import Twilio from 'twilio/lib/rest/Twilio';
import { Repository } from 'typeorm';
import { CreateUserDTO, LoginUserDTO, OTPConfirmDTO, RegisterUserDTO, UpdateUserDTO } from './dtos';
import { currentStore } from 'src/decorator/current-store.decorator';
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
        return this.usersRepository.find({ select: ['id', 'name', 'email', 'phone'] });
    }
    async findStoreUsers(store: Store): Promise<User[]> {
        return this.usersRepository.find({ where: { store }, select: ['id', 'name', 'email', 'phone'] })
    }

    async create(body: RegisterUserDTO): Promise<{ message: string }> {
        const user = await this.findByPhone(body.phone)
        if (user) {
            throw new BadRequestException(USER_MESSAGES.USER_ALREADY_EXISTS)
        }
        const salt = await bcrypt?.genSalt(10)
        body.password = await bcrypt?.hash(body.password, salt)
        const otp = String(Math.floor(USER_CONSTANTS.MIN_OTP + Math.random() * USER_CONSTANTS.MAX_OTP))
        const newUser = await this.usersRepository.create(body).save()
        await this.redisService.setExpire(newUser.phone, otp, USER_CONSTANTS.OTP_EXPIRE_TIME)
        this.sendSMS(otp, newUser.phone)
        await this.redisService.setExpire(otp, 1, USER_CONSTANTS.OTP_EXPIRE_TIME)
        return { message: USER_MESSAGES.SENT_OTP }
    }


    async sendSMS(otp: string, number: string): Promise<Twilio.RequestOptions> {
        return this.twilioService.client.messages.create({
            body: USER_MESSAGES.RECEIVE_OTP + otp,
            from: TWILIO_PHONE_NUMBER,
            to: number,
        });
    }

    async saveUser(user: User): Promise<User> {
        return this.usersRepository.save(user)
    }

    async login(user: LoginUserDTO): Promise<{ message: string }> {
        const existedUser = await this.findByPhone(user.phone)
        if (!existedUser) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        if (!await bcrypt.compare(user.password, existedUser.password)) {
            throw new NotFoundException(STORE_MESSAGES.WRONG_PASSWORD)
        }
        const otp = Math.floor(USER_CONSTANTS.MIN_OTP + Math.random() * USER_CONSTANTS.MAX_OTP) as unknown as string;
        await this.redisService.setExpire(String(existedUser.id), otp, USER_CONSTANTS.OTP_EXPIRE_TIME)
        this.sendSMS(otp, existedUser.phone)
        return { message: USER_MESSAGES.SENT_OTP }
    }

    async confirmLoginOTP(body: OTPConfirmDTO): Promise<{ ReturnUserDTO: any, accessToken: string } | { message: string }> {
        const user = await this.findByPhone(body.phone)
        const storedOTP = await this.redisService.get(String(user.id))
        if (storedOTP == body.otp) {
            const ReturnUserDTO = await this.usersRepository.find({ where: { id: user.id }, select: ['id', 'name', 'email', 'phone'] })
            const accessToken = await this.generateToken(user)
            await this.redisService.setExpire(JSON.stringify(user.id), accessToken, USER_CONSTANTS.TOKEN_EXPIRE_TIME)
            await this.redisService.del(String(storedOTP))
            return { ReturnUserDTO, accessToken }
        }
        else {
            const currentTry: number = JSON.parse(await this.redisService.get(storedOTP))
            await this.redisService.setExpire(String(storedOTP), currentTry + 1, USER_CONSTANTS.OTP_EXPIRE_TIME)
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
            return null
        }
        return user
    }

    async findById(id: number): Promise<User> {
        return this.usersRepository.findOne({ where: { id }, select: ['id', 'name', 'email', 'phone'] })
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: id }, select: ['id', 'name', 'email', 'phone'] })
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
        await this.usersRepository.save({
            ...user,
            point: user.point + point
        })
        return this.usersRepository.findOne({ where: { id }, select: ['id', 'name', 'phone', 'email', 'point'] })
    }

    async accumulatePoint(user: User, price: number, store: Store): Promise<{ user: User, point: number }> {
        const targetUser = await this.usersRepository.findOne({ where: { id: user.id }, relations: ['store'] })
        let point = targetUser.point
        point += USER_CONSTANTS.FIXED_POINT_ADDED(price)
        let bonus = 0
        if (price < USER_CONSTANTS.PRICE_BONUS_LEVEL) {
            bonus = Math.floor(price * 0.1)
            if (bonus > USER_CONSTANTS.FIRST_BONUS_LIMIT) {
                bonus = USER_CONSTANTS.FIRST_BONUS_RATE
            }
        }
        else if (USER_CONSTANTS.PRICE_BONUS_LEVEL < price) {
            bonus = Math.floor(price * USER_CONSTANTS.SECOND_BONUS_RATE)
            if (bonus > USER_CONSTANTS.SECOND_BONUS_LIMIT) {
                bonus = USER_CONSTANTS.SECOND_BONUS_LIMIT
            }
        }
        if (store.rankFormula == EFormula.LIMITATION) {
            bonus += USER_CONSTANTS.LIMITATION_FORMULA(price, USER_CONSTANTS.RANK_DIFF[targetUser.Rank])
        } else {
            bonus += USER_CONSTANTS.PERCENTAGE_FORMULA(price, USER_CONSTANTS.PERCENT_DIFF[targetUser.Rank], USER_CONSTANTS.LIMIT_DIFF[user.Rank])
        }
        point += bonus
        if (point >= USER_CONSTANTS.SILVER_POINT.MIN && point < USER_CONSTANTS.SILVER_POINT.MAX && user.Rank == ERank.BRONZE) {
            user.Rank = ERank.SILVER
        }
        else if (point >= USER_CONSTANTS.GOLD_POINT) {
            user.Rank = ERank.GOLD
        }
        return { user, point }
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
        return this.usersRepository.findOne({ where: { id: user.id }, select: ['id', 'name', 'email', 'phone'] })
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
        return this.usersRepository.findOne({ where: { id: user.id }, select: ['id', 'name', 'email', 'phone'] })
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
        await this.redisService.setExpire(token, 1, USER_CONSTANTS.TOKEN_EXPIRE_TIME)
        return { message: USER_MESSAGES.LOGOUT }
    }

    async generateToken(user: User): Promise<string> {
        const payload = { id: user?.id, email: user?.email, role: ERole.USER }
        return this.jwtService.signAsync(payload)
    }
}

