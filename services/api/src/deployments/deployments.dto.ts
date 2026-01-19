import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateDeploymentDto {
  @IsIn(['STORE_ALL', 'DEVICE'])
  targetType!: 'STORE_ALL' | 'DEVICE';

  @IsOptional()
  @IsString()
  targetDeviceId?: string;

  @IsString()
  playlistId!: string;

  @IsIn(['SPLIT2', 'SPLIT3_CALL_1450x1080', 'FULLSCREEN'])
  layoutPreset!: 'SPLIT2' | 'SPLIT3_CALL_1450x1080' | 'FULLSCREEN';
}

export class RollbackDto {
  @IsString()
  toVersion!: string;
}
