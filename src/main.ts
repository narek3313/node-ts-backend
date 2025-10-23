import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const options = new DocumentBuilder()
        .setTitle('My API')
        .setDescription('API documentation for My App')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'Authorization')
        .addApiKey({ type: 'apiKey', name: 'refreshToken', in: 'header' }, 'RefreshTokenAuth')
        .addApiKey({ type: 'apiKey', name: 'sessionId', in: 'header' }, 'SessionIdAuth')
        .build();

    app.setGlobalPrefix('api/v1');

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: false,
            whitelist: true,
            forbidNonWhitelisted: true,
            stopAtFirstError: true,
        }),
    );

    app.enableShutdownHooks();

    await app.listen(3000);
    console.log('listening on 3000');
}

void bootstrap();
