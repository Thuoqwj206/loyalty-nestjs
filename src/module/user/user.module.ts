
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { User } from 'src/model/user.model';
import { AdminModule } from '../admin/admin.module';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { StoreModule } from '../store/store.module';
import { TwilioModule } from 'nestjs-twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [TwilioModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (cfg: ConfigService) => ({
            accountSid: cfg.get('TWILIO_ACCOUNT_SID'),
            authToken: cfg.get('TWILIO_AUTH_TOKEN'),
        }),
        inject: [ConfigService],
    }), forwardRef(() => StoreModule), TypeOrmModule.forFeature([User]), MailModule, AdminModule],
    providers: [UserService,],
    controllers: [UsersController],
    exports: [UserService]
})
export class UserModule { }