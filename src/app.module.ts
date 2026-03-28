import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ArtistsModule } from './artists/artists.module';
import { EventsModule } from './events/events.module';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { ArtistasModule } from './artistas/artistas.module';

@Module({
  imports: [
    // Variables de entorno disponibles en toda la app
    ConfigModule.forRoot({ isGlobal: true }),

    // Prisma global (MariaDB)
    PrismaModule,

    // Módulos de dominio
    ArtistsModule,
    EventsModule,
    BookingModule,
    AuthModule,
    MailModule,
    UsersModule,
    ArtistasModule,
  ],
})
export class AppModule {}
