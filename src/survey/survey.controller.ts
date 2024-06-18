import { Controller, Post, Get, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { Survey } from './entities/survey.entity';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  async createSurvey(
    @Body('title') title: string,
    @Body('questions') questions: string[]
  ): Promise<{ surveyId: number }> {
    const surveyId = await this.surveyService.createSurvey(title, questions);
    return { surveyId };
  }

  @Get()
  async getAllSurveys(): Promise<Survey[]> {
    return this.surveyService.getAllSurveys();
  }

  @Get(':id/status')
  async getSurveyStatus(@Param('id') surveyId: number): Promise<{ status: string }> {
    try {
      const status = await this.surveyService.getSurveyStatus(surveyId);
      return { status };
    } catch (error) {
      throw new NotFoundException('Survey not found');
    }
  }

  @Delete(':id')
  async deleteSurvey(@Param('id') surveyId: number): Promise<{ message: string }> {
    try {
      await this.surveyService.deleteSurvey(surveyId);
      return { message: 'Survey deleted' };
    } catch (error) {
      throw new NotFoundException('Survey not found');
    }
  }
}
