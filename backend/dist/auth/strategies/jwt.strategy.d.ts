import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AdminsService } from '../../admins/admins.service';
import { JwtPayload } from '../../types/auth.types';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    private adminsService;
    constructor(usersService: UsersService, adminsService: AdminsService, configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        name: string;
        id: string;
        type: "user" | "admin";
    } | {
        email: string;
        id: string;
        type: "user" | "admin";
    }>;
}
export {};
