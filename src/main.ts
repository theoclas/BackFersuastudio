import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Prefijo global de API ──
  app.setGlobalPrefix('api');

  // ── CORS — permite llamadas desde el frontend ──
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // ── Validación automática con class-validator ──
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Elimina campos no declarados en el DTO
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── Swagger / Documentación API ──
  const config = new DocumentBuilder()
    .setTitle('FersuaStudio API')
    .setDescription('API de gestión de artistas, booking y eventos — FersuaStudio')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Artists', 'Gestión de artistas')
    .addTag('Events', 'Próximos shows y fechas')
    .addTag('Booking', 'Solicitudes de booking')
    .addTag('Auth', 'Autenticación de administradores')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\n🚀 FersuaStudio API corriendo en: http://localhost:${port}/api`);
  console.log(`📖 Swagger docs en:               http://localhost:${port}/api/docs\n`);
}

bootstrap();
