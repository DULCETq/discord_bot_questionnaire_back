import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotService } from './bot.service';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [ConfigModule, TaskModule],
  providers: [BotService],
})
export class BotModule {}
