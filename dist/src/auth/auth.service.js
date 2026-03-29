"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const client_1 = require("@prisma/client");
function envFlag(value) {
    const v = value?.trim().toLowerCase();
    return v === 'true' || v === '1' || v === 'yes';
}
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    isPublicRegistrationEnabled() {
        return envFlag(this.config.get('PUBLIC_REGISTRATION_ENABLED'));
    }
    isRegistrationInactiveByDefault() {
        return envFlag(this.config.get('REGISTRATION_DEFAULT_INACTIVE'));
    }
    async register(dto) {
        if (!this.isPublicRegistrationEnabled()) {
            throw new common_1.ForbiddenException('El registro público está deshabilitado.');
        }
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists) {
            throw new common_1.ConflictException('Ya existe una cuenta con ese correo.');
        }
        const hash = await bcrypt.hash(dto.password, 10);
        const isActive = !this.isRegistrationInactiveByDefault();
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hash,
                name: dto.name,
                role: client_1.UserRole.MANAGER,
                isActive,
            },
            include: {
                artists: {
                    select: { id: true, slug: true, name: true, coverImage: true },
                },
            },
        });
        if (!user.isActive) {
            return {
                access_token: null,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    artists: user.artists,
                },
                message: 'Tu cuenta fue creada pero está pendiente de activación por un administrador. No podrás iniciar sesión hasta entonces.',
            };
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = await this.jwt.signAsync(payload);
        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                artists: user.artists,
            },
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: {
                artists: {
                    select: { id: true, slug: true, name: true, coverImage: true }
                }
            }
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = await this.jwt.signAsync(payload);
        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                artists: user.artists,
            },
        };
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Sesión no válida');
        }
        const valid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('La contraseña actual no es correcta');
        }
        if (dto.newPassword === dto.currentPassword) {
            throw new common_1.BadRequestException('La nueva contraseña debe ser distinta a la actual');
        }
        const hash = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hash },
        });
        return { message: 'Contraseña actualizada correctamente' };
    }
    async createAdmin(email, password, name) {
        const hash = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: { email, password: hash, name, role: client_1.UserRole.ADMIN },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map