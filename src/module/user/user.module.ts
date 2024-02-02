
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioModule } from 'nestjs-twilio';
import { User } from 'src/model/user.model';
import { AdminModule } from '../admin/admin.module';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { IoRedisModule } from 'src/services/redis/redis.module';
import { StoreModule } from '../store/store.module';

@Module({
    imports: [TwilioModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (cfg: ConfigService) => ({
            accountSid: cfg.get('TWILIO_ACCOUNT_SID'),
            authToken: cfg.get('TWILIO_AUTH_TOKEN'),
        }),
        inject: [ConfigService],
    }), TypeOrmModule.forFeature([User]), IoRedisModule],
    providers: [UserService,],
    controllers: [UsersController],
    exports: [UserService]
})
export class UserModule { }