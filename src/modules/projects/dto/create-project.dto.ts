import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ProjectStatus } from '../enums/project-status.enum';
import { Transform } from 'class-transformer';
import { ProjectLanguage } from '../enums/project-language.enum';

export class CreateProjectDto {
  @IsOptional()
  @IsEnum(ProjectLanguage)
  language?: ProjectLanguage;

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

  @Transform(({ value }: { value: string }) => value || undefined)
  @IsOptional()
  @IsUrl()
  github?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
