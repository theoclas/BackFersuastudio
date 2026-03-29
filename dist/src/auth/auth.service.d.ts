import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            artists: {
                id: string;
                name: string;
                slug: string;
                coverImage: string | null;
            }[];
        };
    }>;
    createAdmin(email: string, password: string, name: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
    }>;
}
