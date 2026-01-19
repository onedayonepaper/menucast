import { IsArray, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlaylistDto {
  @IsString()
  name!: string;
}

export class AddPlaylistItemDto {
  @IsString()
  assetId!: string;

  @IsInt()
  sortOrder!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationSec?: number;
}

export class ReorderItemDto {
  @IsString()
  playlistItemId!: string;

  @IsInt()
  sortOrder!: number;
}

export class ReorderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items!: ReorderItemDto[];
}

export class RemovePlaylistItemDto {
  @IsString()
  playlistItemId!: string;
}
