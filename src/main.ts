import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'typeorm';
import { configApp } from '@app/lib/config.app';
import { SwaggerModule } from '@nestjs/swagger';
import documentBuilder from '@config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  configApp(app);
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
