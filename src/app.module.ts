import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import {TaskModule} from "./task/task.module";
import {BotModule} from "./bot/bot.module";

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    TaskModule,
    BotModule
  ],
})
export class AppModule {}
