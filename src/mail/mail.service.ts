import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Store } from 'src/model/store.model';
import { User } from 'src/model/user.model';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendStoreConfirmationEmail(store: Store, token: string) {
        const url = `${process.env.APP_URL}/store/verify?email=${store.email}&token=${token}`;
        await this.mailerService.sendMail({
            to: store.email,
            subject: 'Welcome to LOYALTY App! Confirm your Email',
            template: './confirmation',
            context: {
                name: store?.name,
                url,
            },
        });
    }

    async sendRequestAdminConfirm(store: Store, hashed: string) {
        const url = `${process.env.APP_URL}/store/confirm?email=${store.email}&token=${hashed}`
        await this.mailerService.sendMail({
            to: process.env.ADMIN_ADDRESS,
            subject: 'We have a new member,confirm it by the link below',
            template: './admin-confirm',
            context: {
                name: store?.name,
                email: store?.email,
                url,
            },
        });
    }

    async sendUserConfirmationEmail(user: User, otp: string) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to LOYALTY App! Confirm your Email',
            template: './user-otp-verify',
            context: {
                name: user?.name,
                otp: otp
            },
        });
    }
}
