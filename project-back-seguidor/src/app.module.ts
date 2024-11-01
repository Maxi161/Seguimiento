import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModule } from './modules/data/data.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/users/users.module';
import { MessageModule } from './modules/messages/mesaeges.module';
import { ApplicationModule } from './modules/application/application.module';

@Module({
  imports: [
    DataModule,
    DatabaseModule,
    UserModule,
    ApplicationModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
