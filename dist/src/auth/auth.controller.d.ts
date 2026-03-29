import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    me(): {
        message: string;
    };
}
