import {IsNotEmpty, IsInt, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Описание задачи' })
  description!: string;

  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Продолжительность задачи в минутах' })
  duration!: number;
}