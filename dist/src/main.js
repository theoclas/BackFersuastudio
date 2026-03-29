"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const helmet_1 = __importDefault(require("helmet"));
const compression = require('compression');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', 1);
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" }
    }));
    app.use(compression());
    app.setGlobalPrefix('api');
    const corsOrigins = process.env.FRONTEND_URL?.trim();
    const origin = !corsOrigins || corsOrigins === '*'
        ? true
        : corsOrigins.includes(',')
            ? corsOrigins.split(',').map((o) => o.trim()).filter(Boolean)
            : corsOrigins;
    app.enableCors({
        origin,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: process.env.NODE_ENV === 'production',
    }));
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('FersuaStudio API')
            .setDescription('API de gestión de artistas, booking y eventos — FersuaStudio')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('Artists', 'Gestión de artistas')
            .addTag('Events', 'Próximos shows y fechas')
            .addTag('Booking', 'Solicitudes de booking')
            .addTag('Auth', 'Autenticación de administradores')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`\n🚀 FersuaStudio API corriendo en: http://localhost:${port}/api`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`📖 Swagger docs en:               http://localhost:${port}/api/docs\n`);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map