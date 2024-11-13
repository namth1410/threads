import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API Example')
    .setDescription('API documentation for the NestJS application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // URL để truy cập Swagger UI

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.NODE_ENV === 'production' ? 3000 : 4000);
}
bootstrap();
