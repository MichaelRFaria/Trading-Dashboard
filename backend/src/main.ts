import {NestFactory} from '@nestjs/core';
import {AppModule} from './modules/app.module';
import cookieParser from "cookie-parser";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // prevents backend from blocking requests due to different ports (frontend - 3000, backend - 3001)
    app.enableCors({
        origin: "http://localhost:3000",
        credentials: true // required since cookies are used across backend and frontend origins
    })

    app.use(cookieParser()) // for cookie management (https://docs.nestjs.com/techniques/cookies)

    await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
