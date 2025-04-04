import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @Column({ unique: true })
  firebaseUid: string;

  @Exclude()
  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Exclude()
  @Column({ default: 1 })
  level: number;

  @Exclude()
  @Column({ default: 'free' })
  membershipStatus: string;

  @Exclude()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Participant,
  })
  role: UserRole;

  @Exclude()
  @Column({ default: false })
  isBlocked: boolean;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
