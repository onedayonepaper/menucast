import { IsInt, IsOptional, Min } from 'class-validator';

export class CallDto {
  @IsInt()
  @Min(1)
  number!: number;
}

export class ResetDto {
  @IsInt()
  @Min(1)
  toNumber!: number;
}
