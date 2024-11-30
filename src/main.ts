import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PinoLoggerService } from './logger/pino-logger.service';
import { AppModule } from './app.module';
import { ASYNC_STORAGE } from './logger/logger.constants';
import { v4 as uuidv4 } from 'uuid';

async function main() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });

  app.use((req, res, next) => {
    const asyncStorage = app.get(ASYNC_STORAGE);
    const traceId = req.headers['x-request-id'] || uuidv4();
    const store = new Map().set('traceId', traceId);
    asyncStorage.run(store, () => {
      next();
    });
  });
  app.useLogger(app.get(PinoLoggerService));

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('TestTask')
    .setDescription(
      'Тестовое задание для BotHub на фреймворке NestJS. *Примечание: к ендпоинтам, в которых указано "Доступ у администратора", имеют доступ пользователи у которых роль admin',
    )
    .setVersion('1.0')
    .addTag('Основные маршруты')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

main();
