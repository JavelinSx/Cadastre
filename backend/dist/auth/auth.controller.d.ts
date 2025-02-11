import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.login-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        entity: {
            id: any;
            role: string;
            name: any;
        };
    }>;
}
