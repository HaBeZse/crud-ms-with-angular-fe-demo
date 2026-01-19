import { NestFactory } from '@nestjs/core';
import { AddressesServiceModule } from './addresses-service.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpLoggingInterceptor } from './common/logging/http-logging.interceptor';
import { requestIdMiddleware } from './common/middleware/request-id.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AddressesServiceModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({}));
  app.use(requestIdMiddleware);
  app.useGlobalInterceptors(app.get(HttpLoggingInterceptor));
  app.useGlobalFilters(app.get(AllExceptionsFilter));

  const config = new DocumentBuilder().setTitle('Address Service API').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
