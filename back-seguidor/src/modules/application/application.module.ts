import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/entities/application.entity';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { ApplicationRepository } from './application.repository';
import { UserModule } from '../users/users.module';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application, User]), UserModule],
  controllers: [ApplicationController],
  providers: [ApplicationService, ApplicationRepository],
})
export class ApplicationModule {}
