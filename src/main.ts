import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
  });

  // Enable CORS with default options
  app.enableCors({
    origin: 'http://localhost:5173', // Replace with the specific origin you want to allow
  });

  app.enableShutdownHooks();
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
