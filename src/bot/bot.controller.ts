import { Controller, Post, Body } from '@nestjs/common';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('send-message')
  async sendMessage(@Body('channelId') channelId: string, @Body('message') message: string) {
    await this.botService.sendMessage(channelId, message);
    return { message: 'Message sent' };
  }

  @Post('command')
  async sendCommand(@Body('command') command: string) {
    await this.botService.sendCommand(command);
    return { message: 'Command processed' };
  }
}
