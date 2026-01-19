import { AuthService } from './auth.service';
import { LoginDto, RefreshDto } from './auth.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    login(dto: LoginDto): Promise<import("../common/api-response").ApiOk<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            storeId: string;
        };
    }>>;
    refresh(dto: RefreshDto): Promise<import("../common/api-response").ApiOk<{
        accessToken: string;
    }>>;
}
