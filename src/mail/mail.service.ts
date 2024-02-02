import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ADMIN_ADDRESS, APP_URL } from 'src/config';
import { Store } from 'src/model/store.model';
import { User } from 'src/model/user.model';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendStoreConfirmationEmail(store: Store, token: string) {
        const url = `${APP_URL}/store/verify?email=${store.email}&token=${token}`;
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

    async sendRequestAdminConfirm(store: Store, token: string) {
        const url = `${APP_URL}/store/confirm?email=${store.email}&token=${token}`
        await this.mailerService.sendMail({
            to: ADMIN_ADDRESS,
            subject: 'We have login request, confirm it by the link below',
            template: './admin-confirm',
            context: {
                name: store?.name,
                email: store?.email,
                url,
            },
        });
    }
}
