import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // prevents backend from blocking requests due to different ports (frontend - 3000, backend - 3001)
  app.enableCors({
    origin: "http://localhost:3000"
  })
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
