import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminLoginDto } from 'auth/dto/auth.login-admin.dto';
export declare class AdminsController {
    private readonly adminsService;
    authService: any;
    constructor(adminsService: AdminsService);
    login(loginDto: AdminLoginDto): Promise<any>;
    create(createAdminDto: CreateAdminDto): Promise<import("./schemas/admin.schema").Admin>;
    getProfile(req: any): Promise<import("./schemas/admin.schema").AdminDocument>;
}
