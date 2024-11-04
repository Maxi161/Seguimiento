import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeORMConfig from 'src/config/typeORM.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeORMConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const configTypeORM = configService.get('typeorm');
        if (!configTypeORM) {
          throw new Error('TypeORM configuration is missing');
        }
        return configTypeORM;
      },
    }),
  ],
})
export class DatabaseModule {}
