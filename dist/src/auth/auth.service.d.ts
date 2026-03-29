import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    isPublicRegistrationEnabled(): boolean;
    private isRegistrationInactiveByDefault;
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
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    createAdmin(email: string, password: string, name: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
    }>;
}
