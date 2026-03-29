import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import helmet from 'helmet';
const compression = require('compression');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Confianza en Proxy de Hostinger (esencial para límites de tasa reales) ──
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // ── Seguridad de Cabeceras (Helmet) ──
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Permite cargar imágenes desde el frontend
  }));

  // ── Compresión GZIP (Mejora la velocidad de respuesta) ──
  app.use(compression());

  // ── Prefijo global de API ──
  app.setGlobalPrefix('api');

  // ── CORS — permite llamadas desde el frontend ──
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
    credentials: true,
  });

  // ── Validación automática y Protección contra Inyección de Payload ──
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Elimina campos no declarados en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían basura en el body
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production', // No filtrar errores detallados al frontend en prod
    }),
  );

  // ── Swagger / Documentación API (Oculto en Producción por seguridad visual) ──
  if (process.env.NODE_ENV !== 'production') {
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
  }

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`\n🚀 FersuaStudio API corriendo en: http://localhost:${port}/api`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📖 Swagger docs en:               http://localhost:${port}/api/docs\n`);
  }
}


bootstrap();
