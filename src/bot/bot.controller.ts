import { Controller, Post, Body, Get } from '@nestjs/common';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('start')
  async startBot() {
    await this.botService.startBot();
    return { message: 'Bot started' };
  }

  @Post('send-message')
  async sendMessage(@Body('channelId') channelId: string, @Body('message') message: string) {
    await this.botService.sendMessage(channelId, message);
    return { message: 'Message sent' };
  }
}
