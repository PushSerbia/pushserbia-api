import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
