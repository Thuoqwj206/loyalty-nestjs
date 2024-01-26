import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Body, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { TwilioService } from 'nestjs-twilio';
import { ERank, EStatus } from 'src/enum';
import { Store } from 'src/model/store.model';
import { User } from 'src/model/user.model';
import { Repository } from 'typeorm';
import { LoginUserDTO } from './dtos/login-user.dto';
import { OTPConfirmDTO } from './dtos/otp-confirm.dto';
import { RegisterUserDTO } from './dtos/register-user.dto';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly twilioService: TwilioService,
        private readonly jwtService: JwtService,

    ) { }

    async findAll(): Promise<User[]> {
        const users = await this.usersRepository.find();
        if (users) {
            return users
        }
    }

    async create(@Body() Body: RegisterUserDTO) {
        const user = await this.findByEmail(Body.email)
        if (user) {
            throw new BadRequestException('User already existed')
        }
        const salt = await bcrypt?.genSalt(10)
        Body.password = await bcrypt?.hash(Body.password, salt)
        const otp = Math.floor(100000 + Math.random() * 900000) as unknown as string;
        const newUser = await this.usersRepository.create(Body)
        await this.usersRepository.save(newUser)
        await this.cacheManager.set(newUser.id, otp, 60000)
        await this.sendSMS(otp, newUser.phone)
        await this.cacheManager.set(otp, 1, 30000)
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
            throw new NotFoundException('Not found User')
        }
        const storedOTP = await this.cacheManager.get(user?.id)
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
            await this.cacheManager.del(storedOTP)
            await this.cacheManager.del(user?.id)
            return ReturnUserDTO
        }
        else {
            const currentTry = await this.cacheManager.get(storedOTP)
            await this.cacheManager.set(storedOTP, currentTry + 1)
            if (await this.cacheManager.get(storedOTP) > 3) {
                await this.usersRepository.remove(user)
                throw new NotFoundException('Not Found User')
            }
            else { return `Wrong OTP, you have ${3 - currentTry} times left` }
        }
    }
    async confirmLoginOTP(body: OTPConfirmDTO) {
        const user = await this.findByEmail(body.email)
        const storedOTP = await this.cacheManager.get(user?.id)
        if (storedOTP == body.otp) {
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
            await this.cacheManager.del(storedOTP)
            await this.cacheManager.del(user?.id)
            return { ReturnUserDTO, accessToken }
        }
        else {
            const currentTry = await this.cacheManager.get(storedOTP)
            await this.cacheManager.set(storedOTP, currentTry + 1)
            if (await this.cacheManager.get(storedOTP) > 3) {
                throw new NotFoundException('Cook')
            }
            else { return `Wrong OTP, you have ${3 - currentTry} times left` }
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
        const user = await this.usersRepository.findOne({ where: { email } })
        if (user) {
            return user
        }
        else {
        }
    }

    async login(user: LoginUserDTO) {
        const existedUser = await this.findByEmail(user.email)
        if (!existedUser) {
            throw new NotFoundException('Not found Store Email')
        }
        if (!await bcrypt.compare(user.password, existedUser.password)) {
            throw new NotFoundException('Wrong password')
        }
        const otp = Math.floor(100000 + Math.random() * 900000) as unknown as string;
        await this.cacheManager.set(existedUser.id, otp, 60000)
        await this.sendSMS(otp, existedUser.phone)
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: id } })
        if (!user) {
            throw new NotFoundException()
        }
        return user
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
                bonus += Math.floor((price / 100)) * 5
                point += bonus
                if (point >= 2000 && point < 5000) {
                    user.Rank = ERank.SILVER
                }
                else if (point >= 5000) {
                    user.Rank = ERank.GOLD
                }
                break
            }
            case ERank.SILVER: {
                bonus += Math.floor((price / 100)) * 10
                point += bonus
                if (point >= 5000) {
                    user.Rank = ERank.GOLD
                }
                break
            }
            case ERank.GOLD: {
                bonus += Math.floor((price / 100)) * 15
                point += bonus
                break
            }
        }
        return await this.usersRepository.save({
            ...user,
            point
        })
    }


    async logout(user: User) {
        if (!user) {
            throw new NotFoundException()
        }
        this.usersRepository.save({
            ...user,
            status: EStatus.INVALIDATED
        })
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async generateToken(user: User) {
        const payload = { id: user?.id, email: user?.email }
        return await this.jwtService.signAsync(payload)
    }

}

