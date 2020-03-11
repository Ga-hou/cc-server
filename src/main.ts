import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.log(123123, process.env.DATABASE_PASSWORD)
  await app.listen(8081);
}
bootstrap();
