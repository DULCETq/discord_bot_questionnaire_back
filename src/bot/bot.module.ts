import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { Task } from "../task/entities/task.entity";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { TaskService } from "../task/task.service";
import {SurveyService} from "../survey/survey.service";
import {Survey} from "../survey/entities/survey.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Survey]),
    ConfigModule,
  ],
  controllers: [BotController],
  providers: [BotService, TaskService, SurveyService],
})
export class BotModule {}