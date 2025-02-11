import { ConfigService } from '@nestjs/config';
import { AdminsService } from 'admins/admins.service';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from 'types/auth.types';
import { UsersService } from 'users/users.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    private adminsService;
    constructor(usersService: UsersService, adminsService: AdminsService, configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        login: string;
        id: string;
        role: import("types/auth.types").UserRole;
    } | {
        email: string;
        id: string;
        role: import("types/auth.types").UserRole;
    }>;
}
export {};
