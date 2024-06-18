import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './entities/survey.entity';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
  ) {}

  async createSurvey(title: string, questions: string[]): Promise<number> {
    const newSurvey = this.surveyRepository.create({
      title,
      questions,
      status: 'created',
    });
    await this.surveyRepository.save(newSurvey);
    return newSurvey.id;
  }

  async getAllSurveys(): Promise<Survey[]> {
    return this.surveyRepository.find();
  }

  async getSurveyStatus(surveyId: number): Promise<string> {
    const survey = await this.surveyRepository.findOne({where: {id: surveyId}});
    if (survey) {
      return survey.status;
    }
    throw new NotFoundException('Survey not found');
  }

  async deleteSurvey(surveyId: number): Promise<void> {
    const survey = await this.surveyRepository.findOne({where: {id: surveyId}});
    if (survey) {
      await this.surveyRepository.remove(survey);
    } else {
      throw new NotFoundException('Survey not found');
    }
  }
}
