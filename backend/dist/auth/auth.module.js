"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const users_module_1 = require("../users/users.module");
const admins_module_1 = require("../admins/admins.module");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const auth_service_admin_1 = require("./services/auth.service.admin");
const auth_service_user_1 = require("./services/auth.service.user");
const auth_controller_admin_1 = require("./controllers/auth.controller.admin");
const auth_controller_user_1 = require("./controllers/auth.controller.user");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const user_auth_guard_1 = require("../guards/user-auth.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            users_module_1.UsersModule,
            admins_module_1.AdminsModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRATION') || '1d',
                    },
                }),
            }),
        ],
        providers: [
            auth_service_admin_1.AdminAuthService,
            auth_service_user_1.UserAuthService,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            admin_auth_guard_1.AdminAuthGuard,
            user_auth_guard_1.UserAuthGuard,
        ],
        controllers: [auth_controller_admin_1.AdminAuthController, auth_controller_user_1.UserAuthController],
        exports: [jwt_auth_guard_1.JwtAuthGuard, admin_auth_guard_1.AdminAuthGuard, user_auth_guard_1.UserAuthGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map