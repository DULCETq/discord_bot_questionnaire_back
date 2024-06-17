import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID', example: 1 })
  public id!: number;

  @Column()
  @ApiProperty({ description: 'Описание' })
  public description!: string;

  @Column('int')
  @ApiProperty({ description: 'Продолжительность' })
  public duration!: number;

  @Column({ default: 'pending' })
  @ApiProperty({ description: 'Статус', default: 'pending' })
  public status!: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Исполнитель', example: 'user123' })
  public assignedTo?: string;
}
