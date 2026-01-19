import { DevicesService } from './devices.service';
import { RegisterDeviceDto, HeartbeatDto } from './devices.dto';
import { WsGateway } from '../ws/ws.gateway';
export declare class DevicesController {
    private readonly devices;
    private readonly ws;
    constructor(devices: DevicesService, ws: WsGateway);
    createCode(req: any): Promise<import("../common/api-response").ApiOk<{
        code: string;
        expiresAt: string;
    }>>;
    register(dto: RegisterDeviceDto): Promise<import("../common/api-response").ApiOk<{
        deviceId: string;
        deviceToken: string;
        storeId: string;
    }>>;
    list(req: any): Promise<import("../common/api-response").ApiOk<{
        id: string;
        name: string;
        screenProfile: string;
        lastSeenAt: string | null;
        createdAt: string;
    }[]>>;
    heartbeat(token: string | undefined, dto: HeartbeatDto): Promise<import("../common/api-response").ApiOk<{
        accepted: boolean;
    }>>;
}
