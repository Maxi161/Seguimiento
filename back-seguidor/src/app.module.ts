import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModule } from './modules/data/data.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/users/users.module';
import { ApplicationModule } from './modules/application/application.module';
import { ConnectionModule } from './modules/connections/connection.module';
import { MessageModule } from './modules/messages/messages.module';

@Module({
  imports: [
    DataModule,
    DatabaseModule,
    UserModule,
    ApplicationModule,
    MessageModule,
    ConnectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
