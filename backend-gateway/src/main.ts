import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

    // Habilitar CORS
    app.enableCors({
      origin: 'http://localhost:9001', // Permitir solicitudes desde quasar
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

  // Configurar el puerto
  await app.listen(3000);
  console.log('backend-gateway running on port 3000');
}
bootstrap();