import {Injectable, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Client, GatewayIntentBits} from 'discord.js';
import {TaskService} from '../task/task.service';

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

      if (content.startsWith('!создать_задачу')) {
        const [command, description, duration] = content.split('"').map(part => part.trim()).filter(part => part);
        const taskId = await this.taskService.createTask(description, +duration);
        msg.reply(`Task created with ID: ${taskId}`);
      } else if (content.startsWith('!статус_задачи')) {
        const taskId = parseInt(content.split(' ')[1]);
        const status = await this.taskService.getTaskStatus(taskId);
        msg.reply(`Status of task ${taskId}: ${status}`);
      } else if (content.startsWith('!обновить_задачу')) {
        const [command, taskId, status] = content.split(' ');
        await this.taskService.updateTaskStatus(+taskId, status);
        msg.reply(`Task ${taskId} status updated to ${status}`);
      } else if (content.startsWith('!назначать_задачу')) {
        const parts = content.split(' ');
        if (parts.length < 3) {
          msg.reply('Error: The command is missing parameters.');
          return;
        }

        const taskId = parseInt(parts[1], 10);
        const userId = parts[2].trim();

        if (isNaN(taskId)) {
          msg.reply('Error: The task ID must be a number.');
          return;
        }

        try {
          await this.taskService.assignTask(taskId, userId);
          msg.reply(`Task ${taskId} assigned to user ${userId}`);
        } catch (error: any) {
          msg.reply(error.message);
        }
      } else if (content.startsWith('!найти_исполнителя')) {
        const idString = content.split(' ')[1];
        const taskId = parseInt(idString);

        if (isNaN(taskId)) {
          msg.reply(`Incorrect task ID: ${idString}`);
          return;
        }

        const executor = await this.taskService.findExecutor(taskId);
        msg.reply(`Executor for task ${taskId}: ${executor}`);
      }
    });

    await this.client.login(this.configService.get<string>('discordBotToken'));
  }
}
