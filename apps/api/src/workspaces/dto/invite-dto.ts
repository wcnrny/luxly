import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// Backend DTO Örneği
export class AddMemberDto {
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @IsEmail()
  email: string;
}
