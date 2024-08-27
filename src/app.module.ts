import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MapModule } from './map/map.module';
import { RedisModule } from './redis/redis.module';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: configService.get('POSTGRES_SYNC'),
    logging: ['query', 'error'], // row query 출력
    retryAttempts: 5,
    retryDelay: 3000,
    ssl: {
      rejectUnauthorized: false, // 인증서 검증 비활성화 (신뢰할 수 없는 인증서의 경우)
    },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MapModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
