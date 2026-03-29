import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registrationOpen(): {
        publicRegistrationEnabled: boolean;
    };
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            artists: {
                id: string;
                name: string;
                slug: string;
                coverImage: string | null;
            }[];
        };
    }>;
    register(dto: RegisterDto): Promise<{
        access_token: string | null;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            artists: {
                id: string;
                name: string;
                slug: string;
                coverImage: string | null;
            }[];
        };
        message: string;
    } | {
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            artists: {
                id: string;
                name: string;
                slug: string;
                coverImage: string | null;
            }[];
        };
        message?: undefined;
    }>;
    changePassword(req: {
        user: {
            id: string;
        };
    }, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    me(): {
        message: string;
    };
}
