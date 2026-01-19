import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProfileServiceModule } from './profile-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProfileServiceModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({}));

  const config = new DocumentBuilder().setTitle('Address Service API').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
