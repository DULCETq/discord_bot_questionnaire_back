import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import {TaskModule} from "./task/task.module";
import {BotModule} from "./bot/bot.module";
import {SurveyModule} from "./survey/survey.module";

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    TaskModule,
    BotModule,
    SurveyModule
  ],
})
export class AppModule {}
