import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'string' })
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'string' })
  projectId: string;

  @ManyToOne(() => Project)
  project: Project;

  @Exclude()
  @Column({ type: 'int' })
  weight: number;

  @CreateDateColumn()
  createdAt: Date;
}
