"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const admins_service_1 = require("../admins/admins.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, adminsService, jwtService) {
        this.usersService = usersService;
        this.adminsService = adminsService;
        this.jwtService = jwtService;
    }
    isEmail(login) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login);
    }
    isPhone(login) {
        return /^\+?[\d\s-]{10,}$/.test(login);
    }
    async validateUser(login, password) {
        if (this.isEmail(login)) {
            const user = await this.usersService.findByEmail(login);
            if (user && (await bcrypt.compare(password, user.password))) {
                const { password } = user, result = __rest(user, ["password"]);
                return Object.assign(Object.assign({}, result), { type: 'user' });
            }
        }
        else if (this.isPhone(login)) {
            const user = await this.usersService.findByPhone(login);
            if (user && (await bcrypt.compare(password, user.password))) {
                const { password } = user, result = __rest(user, ["password"]);
                return Object.assign(Object.assign({}, result), { type: 'user' });
            }
        }
        else {
            const admin = await this.adminsService.findByName(login);
            if (admin && (await bcrypt.compare(password, admin.password))) {
                const { password } = admin, result = __rest(admin, ["password"]);
                return Object.assign(Object.assign({}, result), { type: 'admin' });
            }
        }
        return null;
    }
    async login(entity) {
        var _a, _b;
        const userId = ((_a = entity._doc) === null || _a === void 0 ? void 0 : _a._id) || entity._id;
        const userName = ((_b = entity._doc) === null || _b === void 0 ? void 0 : _b.name) || entity.name;
        const payload = {
            sub: userId,
            name: userName,
            type: 'admin',
        };
        const result = {
            access_token: this.jwtService.sign(payload),
            entity: {
                id: userId.toString(),
                type: 'admin',
                name: userName,
            },
        };
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        admins_service_1.AdminsService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map