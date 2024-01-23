import { BadRequestException, Body, Injectable, NotFoundException, Param, Redirect } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { MailService } from 'src/mail/mail.service';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { User } from 'src/model/user.model';
import { OTPConfirmDTO } from './dtos/otp-confirm.dto';

@Injectable()
export class UserService {
    static otp: string;
    accountSid = process.env.ACCOUNT_SID
    authToken = process.env.AUTH_TOKEN
    client = require('twilio')(this.accountSid, this.authToken)
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly mailService: MailService
    ) { }

    async findAll(): Promise<User[]> {
        const users = await this.usersRepository.find();
        if (users) {
            return users
        }
    }

    async create(@Body() Body: RegisterUserDTO) {
        const user = await this.findByName(Body.email)
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

    async confirmOTP(email: string, body: OTPConfirmDTO) {
        console.log(UserService.otp)
        console.log(body.otp)
        if (UserService.otp == body.otp) {
            const user = await this.findByEmail(email)
            const currentDate = new Date(Date.now())
            const updateUser = {
                ...user,
                email_verified_at: currentDate
            }
            this.usersRepository.save(updateUser)
        }
        else throw new NotFoundException()
    }

    async findByName(name: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { name } })
        if (user) {
            return user
        }
        else {
        }
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { email } })
        if (user) {
            return user
        }
        else {
            throw new NotFoundException()
        }
    }

    async findOne(id: number): Promise<{ user?: User, isSuccess: boolean }> {
        const user = await this.usersRepository.findOne({ where: { id: id } })
        if (!user) {
            return { isSuccess: false }
        }
        return { user, isSuccess: true }
    }
    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

}

