import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { TaskService } from '../task/task.service';

@Injectable()
export class BotService implements OnModuleInit {
  private readonly client: Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly taskService: TaskService,
  ) {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });
  }

  async onModuleInit() {
    this.client.on('messageCreate', async (msg) => {
      if (msg.author.bot) return;

      const content = msg.content.trim();

      if (content.startsWith('!create_task')) {
        const [command, description, duration] = content.split('"').map(part => part.trim()).filter(part => part);
        const taskId = await this.taskService.createTask(description, +duration);
        msg.reply(`Task created with ID: ${taskId}`);
      } else if (content.startsWith('!task_status')) {
        const taskId = parseInt(content.split(' ')[1]);
        const status = await this.taskService.getTaskStatus(taskId);
        msg.reply(`Status of task ${taskId}: ${status}`);
      } else if (content.startsWith('!update_task')) {
        const [command, taskId, status] = content.split(' ');
        await this.taskService.updateTaskStatus(+taskId, status);
        msg.reply(`Task ${taskId} status updated to ${status}`);
      } else if (content.startsWith('!assign_task')) {
        const [command, taskId, userId] = content.split(' ');
        await this.taskService.assignTask(+taskId, userId);
        msg.reply(`Task ${taskId} assigned to user ${userId}`);
      } else if (content.startsWith('!find_executor')) {
        const taskId = parseInt(content.split(' ')[1]);
        const executor = await this.taskService.findExecutor(taskId);
        msg.reply(`Executor for task ${taskId}: ${executor}`);
      }
    });

    await this.client.login(this.configService.get<string>('discordBotToken'));
  }
}
