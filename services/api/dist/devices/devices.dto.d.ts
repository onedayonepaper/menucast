export declare class RegisterDeviceDto {
    code: string;
    name: string;
    screenProfile: string;
}
export declare class HeartbeatDto {
    currentVersion?: number;
    playerStatus?: any;
    cacheStatus?: any;
}
export declare class CreateRegistrationCodeDto {
}
export declare class DeviceTokenHeaderDto {
    deviceToken: string;
}
export declare const screenProfileEnum: readonly ["DEFAULT"];
export type ScreenProfile = (typeof screenProfileEnum)[number];
