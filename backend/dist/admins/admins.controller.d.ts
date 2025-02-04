import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginDto } from '../auth/dto/login.dto';
export declare class AdminsController {
    private readonly adminsService;
    authService: any;
    constructor(adminsService: AdminsService);
    login(loginDto: LoginDto): Promise<any>;
    create(createAdminDto: CreateAdminDto): Promise<import("./schemas/admin.schema").Admin>;
    getProfile(req: any): Promise<import("./schemas/admin.schema").Admin>;
}
