
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { User } from 'src/model/user.model';
import { UsersController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), MailModule],
    providers: [UserService,],
    controllers: [UsersController],
    exports: [UserService]
})
export class UserModule { }