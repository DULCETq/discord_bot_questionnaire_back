import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID опроса', example: 1 })
  public id!: number;

  @Column()
  @ApiProperty({ description: 'Название опроса' })
  public title!: string;

  @Column('text', { array: true })
  @ApiProperty({ description: 'Список вопросов' })
  public questions!: string[];

  @Column({ default: 'created' })
  @ApiProperty({ description: 'Статус опроса', default: 'created' })
  public status!: string;
}
