import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  imageUrl: string;
}
