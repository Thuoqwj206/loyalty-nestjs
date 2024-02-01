import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { TwilioService } from 'nestjs-twilio';
import { STORE_MESSAGES, USER_MESSAGES } from 'src/constant/messages';
import { ERank, ERole, EStatus } from 'src/enum';
import { Store } from 'src/model/store.model';
import { User } from 'src/model/user.model';
import { RedisService } from 'src/services/redis/redis.service';
import { Repository } from 'typeorm';
import { ReturnUserDTO, RegisterUserDTO, OTPConfirmDTO, LoginUserDTO, CreateUserDTO, UpdateUserDTO } from './dtos';
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
        return await this.usersRepository.find();
    }
    async findStoreUsers(store: Store): Promise<ReturnUserDTO[]> {
        const returnUsers: ReturnUserDTO[] = []
        const users = await this.usersRepository.find({ where: { store } })
        for (const user of users) {
            const returnUser = {
                name: user.name,
                email: user.email,
                phone: user.phone,
            }
            returnUsers.push(returnUser)
        }
        return returnUsers
    }

    async create(Body: RegisterUserDTO) {
        const user = await this.findByPhone(Body.phone)
        if (user) {
            throw new BadRequestException(USER_MESSAGES.USER_ALREADY_EXISTS)
        }
        const salt = await bcrypt?.genSalt(10)
        Body.password = await bcrypt?.hash(Body.password, salt)
        const otp = Math.floor(100000 + Math.random() * 900000) as unknown as string;
        const newUser = await this.usersRepository.create(Body)
        await this.usersRepository.save(newUser)
        await this.redisService.setExpire(newUser.phone, otp, 60000)
        await this.sendSMS(otp, newUser.phone)
        await this.redisService.setExpire(otp, 1, 30000)
        return { isSuccess: true }
    }


    async sendSMS(otp: string, number: string) {
        return this.twilioService.client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: number,
        });
    }
    async confirmRegisterOTP(body: OTPConfirmDTO, store: Store) {
        const user = await this.findByEmail(body.email)
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        const storedOTP = await this.redisService.get(user.phone)
        if (storedOTP == body.otp) {
            const currentDate = new Date(Date.now())
            const updateUser = {
                ...user,
                verified_at: currentDate,
                store: store
            } as User
            const ReturnUserDTO = {
                name: updateUser.name,
                email: updateUser.email,
                phone: updateUser.phone,
            }
            await this.usersRepository.save(updateUser)
            await this.redisService.del(String(storedOTP))
            await this.redisService.del(user?.phone)
            return ReturnUserDTO
        }
        else {
            const currentTry = await this.redisService.get(storedOTP) as unknown as number
            await this.redisService.setExpire(String(storedOTP), currentTry + 1, 60000)
            const result = await this.redisService.get(storedOTP) as unknown as number
            if (result > 3) {
                await this.usersRepository.remove(user)
                throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
            }
            return `Wrong OTP, you have ${(3 - currentTry)} times left`
        }
    }
    async login(user: LoginUserDTO) {
        const existedUser = await this.findByEmail(user.email)
        if (!existedUser) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        if (!await bcrypt.compare(user.password, existedUser.password)) {
            throw new NotFoundException(STORE_MESSAGES.WRONG_PASSWORD)
        }
        const otp = Math.floor(100000 + Math.random() * 900000) as unknown as string;
        await this.redisService.setExpire(String(existedUser.id), otp, 60000)
        await this.sendSMS(otp, existedUser.phone)
        return USER_MESSAGES.SENT_OTP
    }

    async confirmLoginOTP(body: OTPConfirmDTO) {
        const user = await this.findByEmail(body.email)
        const storedOTP = await this.redisService.get(String(user.id))
        if (storedOTP == storedOTP) {
            const updateUser = {
                ...user,
                status: EStatus.VALIDATED
            } as User
            await this.usersRepository.save(updateUser)
            const ReturnUserDTO = {
                name: updateUser.name,
                email: updateUser.email,
                phone: updateUser.phone,
            }
            const accessToken = await this.generateToken(updateUser)
            await this.redisService.setExpire(JSON.stringify(user.id), accessToken, 43200000)
            await this.redisService.del(String(storedOTP))
            return { ReturnUserDTO, accessToken }
        }
        else {
            const currentTry = JSON.parse(await this.redisService.get(storedOTP))
            await this.redisService.setExpire(String(storedOTP), currentTry + 1, 600000)
            const result = JSON.parse(await this.redisService.get(storedOTP))
            if (result > 3) {
                throw new NotFoundException(USER_MESSAGES.DEAD_OTP)
            }
            else { return USER_MESSAGES.ATTEMPT_TIME(currentTry) }
        }
    }

    async findByName(name: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { name } })
        if (user) {
            return user
        }
        else {
            throw new NotFoundException()
        }
    }

    async findByEmail(email: string): Promise<User> {
        return await this.usersRepository.findOne({ where: { email } })
    }

    async findByPhone(phone: string): Promise<User> {
        return await this.usersRepository.findOne({ where: { phone } })
    }



    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: id } })
        if (!user) {
            throw new NotFoundException()
        }
        return user
    }

    async addPoint(id: number, point: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: id } })
        if (!user) {
            throw new NotFoundException()
        }
        return await this.usersRepository.save({
            ...user,
            point: user.point + point
        })
    }

    async accumulatePoint(user: User, price: number): Promise<User> {
        let point = user.point
        point += Math.floor(price)
        let bonus = 0
        if (100 < price && price < 200) {
            bonus = Math.floor(price * 0.1)
            if (bonus > 5) {
                bonus = 5
            }
        }
        else if (200 < price) {
            bonus = Math.floor(price * 0.2)
            if (bonus > 10) {
                bonus = 10
            }
        }
        switch (user.Rank) {
            case ERank.BRONZE: {
                this.handleBronzeUpperRank(user, point, bonus, price)
                break
            }
            case ERank.SILVER: {
                this.handleBSilverUpperRank(user, point, bonus, price)
                break
            }
            case ERank.GOLD: {
                this.handleGoldUpperRank(point, bonus, price)
                break
            }
        }
        return await this.usersRepository.save({
            ...user,
            point
        })
    }

    async handleBronzeUpperRank(user: User, point: number, bonus: number, price: number) {
        bonus += Math.floor((price / 100)) * 5
        point += bonus
        if (point >= 2000 && point < 5000) {
            user.Rank = ERank.SILVER
        }
        else if (point >= 5000) {
            user.Rank = ERank.GOLD
        }
    }
    async handleBSilverUpperRank(user: User, point: number, bonus: number, price: number) {
        bonus += Math.floor((price / 100)) * 10
        point += bonus
        if (point >= 5000) {
            user.Rank = ERank.GOLD
        }
    }
    async handleGoldUpperRank(point: number, bonus: number, price: number) {
        bonus += Math.floor((price / 100)) * 15
        point += bonus
    }

    async createUserAdmin(Body: CreateUserDTO) {
        const user = await this.findByPhone(Body.phone)
        if (user) {
            throw new BadRequestException(USER_MESSAGES.USER_ALREADY_EXISTS)
        }
        const salt = await bcrypt?.genSalt(10)
        Body.password = await bcrypt?.hash(Body.password, salt)
        const newUser = this.usersRepository.create(Body)
        return await this.usersRepository.save({
            ...newUser,
            verified_at: new Date(),
        })
    }
    async updateUser(body: UpdateUserDTO, id: number) {
        const user = await this.usersRepository.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        if (body.password) {
            const salt = await bcrypt.genSalt(10)
            body.password = await bcrypt.hash(body.password, salt)
        }
        return this.usersRepository.save({
            ...user,
            ...body
        })
    }

    async deleteUser(id: number) {
        const user = await this.usersRepository.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
        }
        await this.usersRepository.remove(user)
        return USER_MESSAGES.DELETED
    }

    async logout(user: User) {
        if (!user) {
            throw new NotFoundException()
        }
        const token = await this.redisService.get(String(user.id))
        await this.redisService.setExpire(token, 1, 432000)
        await this.usersRepository.save({
            ...user,
            status: EStatus.INVALIDATED
        })
        return USER_MESSAGES.LOGOUT
    }

    async generateToken(user: User) {
        const payload = { id: user?.id, email: user?.email, role: ERole.USER }
        const token = await this.jwtService.signAsync(payload)
        return token
    }

}

