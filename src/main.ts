import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const options = new DocumentBuilder().build();
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
