import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDeviceDto {
  @IsString()
  code!: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  screenProfile!: string;
}

export class HeartbeatDto {
  @IsOptional()
  currentVersion?: number;

  @IsOptional()
  playerStatus?: any;

  @IsOptional()
  cacheStatus?: any;
}

export class CreateRegistrationCodeDto {
  // placeholder for future, keep empty
}

export class DeviceTokenHeaderDto {
  @IsString()
  @MinLength(10)
  deviceToken!: string;
}

export const screenProfileEnum = ['DEFAULT'] as const;
export type ScreenProfile = (typeof screenProfileEnum)[number];
