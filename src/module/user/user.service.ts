import { BadRequestException, Body, Inject, Injectable, NotFoundException, Param, Redirect, UnauthorizedException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { MailService } from 'src/mail/mail.service';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { User } from 'src/model/user.model';
import { OTPConfirmDTO } from './dtos/otp-confirm.dto';
import { Store } from 'src/model/store.model';
import { StoreService } from '../store/store.service';
import { LoginUserDTO } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ERank, EStatus } from 'src/enum';
import { TwilioService } from 'nestjs-twilio';

@Injectable()
export class UserService {
    static otp: string;
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly twilioService: TwilioService,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService
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
        UserService.otp = Math.floor(100000 + Math.random() * 900000) as unknown as string;
        const newUser = await this.usersRepository.create(Body)
        await this.usersRepository.save(newUser)
        this.mailService.sendUserConfirmationEmail(newUser, UserService.otp)
    }

    async confirmRegisterOTP(email: string, body: OTPConfirmDTO, store: Store) {
        const user = await this.findByEmail(email)
        if (UserService.otp == body.otp) {
            const currentDate = new Date(Date.now())
            const updateUser = {
                ...user,
                email_verified_at: currentDate,
                store: store
            } as User
            await this.usersRepository.save(updateUser)
        }
        else {
            this.usersRepository.remove(user)
            throw new NotFoundException()
        }
    }

    async sendSMS() {
        return this.twilioService.client.messages.create({
            body: 'Your OTP is 88888',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: '+84866079148',
        });
    }

    async confirmLoginOTP(email: string, body: OTPConfirmDTO) {
        const user = await this.findByEmail(email)
        if (UserService.otp == body.otp) {
            const updateUser = {
                ...user,
                status: EStatus.VALIDATED
            } as User
            await this.usersRepository.save(updateUser)
            const accessToken = await this.generateToken(updateUser)
            return { updateUser, accessToken }
        }
        else {
            throw new NotFoundException('Wrong OTP')
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
        UserService.otp = Math.floor(100000 + Math.random() * 900000) as unknown as string;
        this.mailService.sendUserConfirmationEmail(existedUser, UserService.otp)
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

