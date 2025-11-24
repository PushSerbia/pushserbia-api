import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ExceptionsFilter } from './core/filters/exceptions.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      skipMissingProperties: true,
    }),
  );

  // Resolve CORS origins from env when provided; fall back to defaults otherwise
  const corsOriginsEnv = process.env.CORS_ORIGINS || '';
  const resolvedOrigins = corsOriginsEnv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      // Support regex entries using either re:/regex/ syntax or plain ^...$ pattern
      if (/^re:/i.test(entry)) {
        const pattern = entry.replace(/^re:/i, '');
        return new RegExp(pattern);
      }
      if (entry.startsWith('^') || entry.endsWith('$')) {
        return new RegExp(entry);
      }
      return entry;
    });
  app.enableCors({
    origin: resolvedOrigins,
    preflightContinue: false,
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
