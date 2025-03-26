import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  firebaseUid: string;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 'free' })
  membershipStatus: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Participant,
  })
  role: UserRole;

  @Column({ default: false })
  isBlocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
