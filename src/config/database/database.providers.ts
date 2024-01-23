import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/model/admin.model';
import { Store } from 'src/model/store.model';
import { User } from 'src/model/user.model';
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'loyalty_data',
            entities: [User, Store, Admin],
            migrations: [`${__dirname}/src/migrations/*{.ts,.js}`],
            migrationsTableName: 'migrations',
            subscribers: [`${__dirname}/subscriber/*{.ts,.js}`],
            synchronize: true,
            logging: ['error'],
        }),
    ],
})
export class DatabaseModule { }