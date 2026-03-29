import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserRole } from '@prisma/client';

function envFlag(value: string | undefined): boolean {
  const v = value?.trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  isPublicRegistrationEnabled(): boolean {
    return envFlag(this.config.get<string>('PUBLIC_REGISTRATION_ENABLED'));
  }

  private isRegistrationInactiveByDefault(): boolean {
    return envFlag(this.config.get<string>('REGISTRATION_DEFAULT_INACTIVE'));
  }

  async register(dto: RegisterDto) {
    if (!this.isPublicRegistrationEnabled()) {
      throw new ForbiddenException('El registro público está deshabilitado.');
    }

    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('Ya existe una cuenta con ese correo.');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const isActive = !this.isRegistrationInactiveByDefault();

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        role: UserRole.MANAGER,
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
        access_token: null as string | null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          artists: user.artists,
        },
        message:
          'Tu cuenta fue creada pero está pendiente de activación por un administrador. No podrás iniciar sesión hasta entonces.',
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

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ 
      where: { email: dto.email },
      include: {
        artists: {
          select: { id: true, slug: true, name: true, coverImage: true }
        }
      }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

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

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Sesión no válida');
    }

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) {
      throw new UnauthorizedException('La contraseña actual no es correcta');
    }

    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException('La nueva contraseña debe ser distinta a la actual');
    }

    const hash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hash },
    });

    return { message: 'Contraseña actualizada correctamente' };
  }

  // Útil para crear el primer admin desde seed
  async createAdmin(email: string, password: string, name: string) {
    const hash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hash, name, role: UserRole.ADMIN },
    });
  }
}
