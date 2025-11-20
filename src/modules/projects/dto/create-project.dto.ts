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

  @Transform(({ value }: { value: string }) => value || undefined)
  @IsOptional()
  @IsUrl()
  github?: string;

  @Transform(({ value }: { value: string }) => value || undefined)
  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
