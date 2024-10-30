import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModule } from './modules/data/data.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/users/users.module';
import { MessageModule } from './modules/messages/mesaeges.module';

@Module({
  imports: [DataModule, DatabaseModule, UserModule, AppModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
