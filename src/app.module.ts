import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { BotModule } from './bot/bot.module';
import {TaskModule} from "./task/task.module";

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    TaskModule,
    BotModule,
  ],
})
export class AppModule {}
