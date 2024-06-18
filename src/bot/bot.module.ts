import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { Task } from "../task/entities/task.entity";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { TaskService } from "../task/task.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ConfigModule,
  ],
  controllers: [BotController],
  providers: [BotService, TaskService],
})
export class BotModule {}