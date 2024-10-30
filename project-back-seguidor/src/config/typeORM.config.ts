import { registerAs } from '@nestjs/config';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  POSTGRES_DB,
} from './env.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Application } from 'src/entities/application.entity';
import { Message } from 'src/entities/message.entity';

export const typeORMconfig = {
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: POSTGRES_DB,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [User, Application, Message],
  synchronize: true,
  logging: ['error', 'query'],
  dropSchema: true,
  migrations: ['dist/.migrations/*{.ts,.js}'],
};

export default registerAs('typeorm', () => typeORMconfig);

export const dbConnection = new DataSource(typeORMconfig as DataSourceOptions);
