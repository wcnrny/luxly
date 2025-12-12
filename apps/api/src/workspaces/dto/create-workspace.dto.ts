import { IsNotEmpty, Min } from 'class-validator';

export class CreateWorkspaceDto {
  @IsNotEmpty()
  @Min(4)
  name: string;
}
