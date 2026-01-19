export declare class CreatePlaylistDto {
    name: string;
}
export declare class AddPlaylistItemDto {
    assetId: string;
    sortOrder: number;
    durationSec?: number;
}
export declare class ReorderItemDto {
    playlistItemId: string;
    sortOrder: number;
}
export declare class ReorderDto {
    items: ReorderItemDto[];
}
export declare class RemovePlaylistItemDto {
    playlistItemId: string;
}
