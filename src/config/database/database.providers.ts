import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin, ExchangeGift, Gift, GiftOrder, Item, Order, OrderItem, Store, User } from 'src/model';
;
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'loyalty_data',
            entities: [User, Store, Admin, Gift, GiftOrder, ExchangeGift, Order, OrderItem, Item],
            migrations: [`${__dirname}/src/migrations/*{.ts,.js}`],
            migrationsTableName: 'migrations',
            subscribers: [`${__dirname}/subscriber/*{.ts,.js}`],
            synchronize: true,
            logging: ['error'],
        }),
    ],
})
export class DatabaseModule { }