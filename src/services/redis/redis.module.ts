import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => {
        return {
          config: {
            global: true,
            host: 'localhost',
            port: 49153,
            password: 'redispw',
          },
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class IoRedisModule { }
