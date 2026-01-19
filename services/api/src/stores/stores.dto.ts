import { IsBoolean, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class PatchSettingsDto {
  @IsOptional()
  @IsBoolean()
  callEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  callListSize?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  callStartNo?: number;

  @IsOptional()
  @IsIn(['SPLIT2', 'SPLIT3_CALL_1450x1080', 'FULLSCREEN'])
  layoutPreset?: 'SPLIT2' | 'SPLIT3_CALL_1450x1080' | 'FULLSCREEN';
}
