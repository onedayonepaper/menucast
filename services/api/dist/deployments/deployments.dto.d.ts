export declare class CreateDeploymentDto {
    targetType: 'STORE_ALL' | 'DEVICE';
    targetDeviceId?: string;
    playlistId: string;
    layoutPreset: 'SPLIT2' | 'SPLIT3_CALL_1450x1080' | 'FULLSCREEN';
}
export declare class RollbackDto {
    toVersion: string;
}
