import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
export declare class AdminsController {
    private readonly adminsService;
    constructor(adminsService: AdminsService);
    create(createAdminDto: CreateAdminDto): Promise<import("./schemas/admin.schema").Admin>;
    getProfile(req: any): Promise<{
        name: string;
        role: string;
    }>;
}
