"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const api_interceptor_1 = require("./common/api.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: false });
    const origins = (process.env.CORS_ORIGINS ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    app.enableCors({
        origin: origins.length ? origins : true,
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new api_interceptor_1.ApiWrapInterceptor());
    const { ValidationPipe } = await import('@nestjs/common');
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = Number(process.env.API_PORT ?? 4000);
    await app.listen(port);
    console.log(`API listening on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map