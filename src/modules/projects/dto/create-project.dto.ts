import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ProjectStatus } from '../enums/project-status.enum';

export class CreateProjectDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsUrl()
  github?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
