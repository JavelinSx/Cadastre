import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AdminsService } from '../admins/admins.service';
export declare class AuthService {
    private usersService;
    private adminsService;
    private jwtService;
    constructor(usersService: UsersService, adminsService: AdminsService, jwtService: JwtService);
    private isEmail;
    private isPhone;
    validateUser(login: string, password: string): Promise<{
        type: string;
        email?: string;
        phone?: string;
        role: string;
    } | {
        type: string;
        name: string;
    }>;
    login(entity: any): Promise<{
        access_token: string;
        entity: {
            id: any;
            type: string;
            name: any;
        };
    }>;
}
