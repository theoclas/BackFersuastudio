import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

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

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwt.signAsync(payload);

    return {
      access_token: token,
      user: { id: user.id, email: user.email, name: user.name, artists: user.artists },
    };
  }

  // Útil para crear el primer admin desde seed
  async createAdmin(email: string, password: string, name: string) {
    const hash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hash, name },
    });
  }
}
