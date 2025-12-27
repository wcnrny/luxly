import { IsOptional } from 'class-validator';

export class CreateWorkspaceDto {
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  iconURL: string;
}
