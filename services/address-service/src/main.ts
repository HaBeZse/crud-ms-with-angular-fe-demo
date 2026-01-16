import { NestFactory } from '@nestjs/core';
import { AddressesServiceModule } from './addresses-service.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AddressesServiceModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({}));

  const config = new DocumentBuilder().setTitle('Address Service API').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
