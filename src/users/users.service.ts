import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const userPublicSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  createdAt: true,
  artists: { select: { id: true, slug: true, name: true } },
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertKeepsAtLeastOneActiveAdmin(
    targetUserId: string,
    before: { role: UserRole; isActive: boolean },
    dto: UpdateUserDto,
  ) {
    const wasAdminActive = before.role === UserRole.ADMIN && before.isActive;
    const losesAdmin =
      dto.role != null && dto.role !== UserRole.ADMIN;
    const deactivated = dto.isActive === false;
    const wouldLose = wasAdminActive && (losesAdmin || deactivated);
    if (!wouldLose) return;

    const other = await this.prisma.user.count({
      where: {
        role: UserRole.ADMIN,
        isActive: true,
        NOT: { id: targetUserId },
      },
    });
    if (other < 1) {
      throw new BadRequestException('Debe existir al menos un administrador activo.');
    }
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('Ya existe un usuario con ese correo.');
    }

    if (dto.artistIds?.length) {
      const count = await this.prisma.artist.count({
        where: { id: { in: dto.artistIds } },
      });
      if (count !== dto.artistIds.length) {
        throw new BadRequestException('Uno o más artistIds no existen.');
      }
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const role = dto.role ?? UserRole.MANAGER;

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

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(actorId: string, id: string, dto: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Usuario no encontrado');

    if (dto.isActive === false && id === actorId) {
      throw new BadRequestException('No puedes desactivar tu propia cuenta.');
    }

    await this.assertKeepsAtLeastOneActiveAdmin(
      id,
      { role: existing.role, isActive: existing.isActive },
      dto,
    );

    if (dto.email && dto.email !== existing.email) {
      const taken = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (taken) throw new ConflictException('Ya existe un usuario con ese correo.');
    }

    if (dto.artistIds != null) {
      const count = await this.prisma.artist.count({
        where: { id: { in: dto.artistIds } },
      });
      if (count !== dto.artistIds.length) {
        throw new BadRequestException('Uno o más artistIds no existen.');
      }
    }

    const data: Record<string, unknown> = {};
    if (dto.email != null) data.email = dto.email;
    if (dto.name != null) data.name = dto.name;
    if (dto.role != null) data.role = dto.role;
    if (dto.isActive != null) data.isActive = dto.isActive;
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
}
