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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
const userPublicSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    isActive: true,
    createdAt: true,
    artists: { select: { id: true, slug: true, name: true } },
};
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertKeepsAtLeastOneActiveAdmin(targetUserId, before, dto) {
        const wasAdminActive = before.role === client_1.UserRole.ADMIN && before.isActive;
        const losesAdmin = dto.role != null && dto.role !== client_1.UserRole.ADMIN;
        const deactivated = dto.isActive === false;
        const wouldLose = wasAdminActive && (losesAdmin || deactivated);
        if (!wouldLose)
            return;
        const other = await this.prisma.user.count({
            where: {
                role: client_1.UserRole.ADMIN,
                isActive: true,
                NOT: { id: targetUserId },
            },
        });
        if (other < 1) {
            throw new common_1.BadRequestException('Debe existir al menos un administrador activo.');
        }
    }
    async create(dto) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists) {
            throw new common_1.ConflictException('Ya existe un usuario con ese correo.');
        }
        if (dto.artistIds?.length) {
            const count = await this.prisma.artist.count({
                where: { id: { in: dto.artistIds } },
            });
            if (count !== dto.artistIds.length) {
                throw new common_1.BadRequestException('Uno o más artistIds no existen.');
            }
        }
        const hash = await bcrypt.hash(dto.password, 10);
        const role = dto.role ?? client_1.UserRole.MANAGER;
        return this.prisma.user.create({
            data: {
                email: dto.email,
                password: hash,
                name: dto.name,
                role,
                artists: dto.artistIds?.length
                    ? { connect: dto.artistIds.map((id) => ({ id })) }
                    : undefined,
            },
            select: userPublicSelect,
        });
    }
    async findAll() {
        return this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: userPublicSelect,
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: userPublicSelect,
        });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        return user;
    }
    async update(actorId, id, dto) {
        const existing = await this.prisma.user.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (dto.isActive === false && id === actorId) {
            throw new common_1.BadRequestException('No puedes desactivar tu propia cuenta.');
        }
        await this.assertKeepsAtLeastOneActiveAdmin(id, { role: existing.role, isActive: existing.isActive }, dto);
        if (dto.email && dto.email !== existing.email) {
            const taken = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (taken)
                throw new common_1.ConflictException('Ya existe un usuario con ese correo.');
        }
        if (dto.artistIds != null) {
            const count = await this.prisma.artist.count({
                where: { id: { in: dto.artistIds } },
            });
            if (count !== dto.artistIds.length) {
                throw new common_1.BadRequestException('Uno o más artistIds no existen.');
            }
        }
        const data = {};
        if (dto.email != null)
            data.email = dto.email;
        if (dto.name != null)
            data.name = dto.name;
        if (dto.role != null)
            data.role = dto.role;
        if (dto.isActive != null)
            data.isActive = dto.isActive;
        if (dto.password != null) {
            data.password = await bcrypt.hash(dto.password, 10);
        }
        if (dto.artistIds != null) {
            data.artists = { set: dto.artistIds.map((aid) => ({ id: aid })) };
        }
        return this.prisma.user.update({
            where: { id },
            data,
            select: userPublicSelect,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map