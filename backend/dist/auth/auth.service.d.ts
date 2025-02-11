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
        role: string;
        email?: string;
        phone?: string;
    } | {
        role: string;
        name: string;
        _id: unknown;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
    }>;
    login(entity: any): Promise<{
        access_token: string;
        entity: {
            id: any;
            role: string;
            name: any;
        };
    }>;
}
