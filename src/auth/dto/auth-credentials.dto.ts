import { IsString, IsNotEmpty } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
