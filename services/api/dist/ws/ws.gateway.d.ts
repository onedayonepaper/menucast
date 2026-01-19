import { Server, Socket } from 'socket.io';
export declare class WsGateway {
    server: Server;
    handleConnection(socket: Socket): void;
    emitDeployUpdate(payload: {
        storeId: string;
        deviceId?: string | null;
        version: number;
    }): void;
    emitCallEvent(payload: {
        storeId: string;
        action: 'CALL' | 'RECALL' | 'RESET';
        number: number;
        ts: string;
    }): void;
    emitDeviceStatus(payload: {
        deviceId: string;
        online: boolean;
        lastSeen: string;
    }): void;
    onPing(socket: Socket, _body: any): void;
}
