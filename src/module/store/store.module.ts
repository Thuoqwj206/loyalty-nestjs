
import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { StoresController } from './store.controller';
import { StoreService } from './store.service';
import { Store } from 'src/model/store.model';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config';

@Module({
    imports: [JwtModule.register(jwtConfig), TypeOrmModule.forFeature([Store]), MailModule],
    providers: [StoreService,],
    controllers: [StoresController],
    exports: [StoreService]
})
export class StoreModule { }