import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // <-- Dodaj to
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1.Doc cfg
  const config = new DocumentBuilder()
    .setTitle('Kanban API')
    .setDescription('API documentation for the Kanban application')
    .setVersion('1.0')
    .addBearerAuth() // Allows pasting the JWT token in the Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 2. Entry point for documentation (e.g., localhost:4000/api)
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );
  app.enableCors();
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
