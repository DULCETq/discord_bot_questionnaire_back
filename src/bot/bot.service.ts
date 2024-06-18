import {Injectable, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Client, GatewayIntentBits, TextChannel, ChannelType, Message} from 'discord.js';
import {TaskService} from '../task/task.service';
import {SurveyService} from '../survey/survey.service';

@Injectable()
export class BotService implements OnModuleInit {
  private readonly client: Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly taskService: TaskService,
    private readonly surveyService: SurveyService,
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  async onModuleInit() {
    this.client.on('messageCreate', async (msg) => {
      if (msg.author.bot) return;

      await this.processCommand(msg);
    });

    await this.client.login(this.configService.get<string>('discordBotToken'));
  }

  async processCommand(msg: Message) {
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
    } else if (content.startsWith('!удалить_задачу')) {
      const taskId = parseInt(content.split(' ')[1]);
      await this.taskService.deleteTask(taskId);
      msg.reply(`Task ${taskId} deleted`);
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
    } else if (content.startsWith('!создать_опрос')) {
      const [command, title, ...questions] = content.split('"').map(part => part.trim()).filter(part => part);
      const surveyId = await this.surveyService.createSurvey(title, questions);
      msg.reply(`Survey created with ID: ${surveyId}`);
    } else if (content.startsWith('!статус_опроса')) {
      const surveyId = parseInt(content.split(' ')[1]);
      const status = await this.surveyService.getSurveyStatus(surveyId);
      msg.reply(`Status of survey ${surveyId}: ${status}`);
    } else if (content.startsWith('!удалить_опрос')) {
      const surveyId = parseInt(content.split(' ')[1]);
      await this.surveyService.deleteSurvey(surveyId);
      msg.reply(`Survey ${surveyId} deleted`);
    }
  }

  async sendCommand(command: string) {
    const fakeMessage = {
      content: command,
      author: {bot: false},
      reply: async (msg: string) => {
        console.log('Reply:', msg);
      },
      channelId: 'fake-channel-id',
      id: 'fake-message-id',
    } as unknown as Message;

    await this.processCommand(fakeMessage);
  }

  async sendMessage(channelId: string, message: string) {
    const channel = await this.client.channels.fetch(channelId);
    if (channel && channel.type === ChannelType.GuildText) {
      await (channel as TextChannel).send(message);
    }
  }
}
