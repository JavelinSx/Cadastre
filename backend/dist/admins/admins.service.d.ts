import { Model } from 'mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin, AdminDocument } from './schemas/admin.schema';
export declare class AdminsService {
    private adminModel;
    constructor(adminModel: Model<AdminDocument>);
    create(createAdminDto: CreateAdminDto): Promise<Admin>;
    findByName(name: string): Promise<Admin>;
    findById(id: string): Promise<Admin>;
}
