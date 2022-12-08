import { INestApplication, ValidationPipe } from '@nestjs/common';

export const configApp = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      whitelist: true,
    }),
  );
};
