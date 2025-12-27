import { IsEmail, IsNotEmpty, Max, Min } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @Min(8)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Min(5)
  @IsNotEmpty()
  username: string;
  @Min(5)
  @Max(20)
  @IsNotEmpty()
  firstName: string;
  @Min(5)
  @Max(20)
  @IsNotEmpty()
  lastName: string;
}
