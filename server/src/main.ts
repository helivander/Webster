import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { LoggerService } from './modules/logger/logger.service';
import { appConfig } from './shared/configs/app.config';
import { fastifyHelmet } from '@fastify/helmet';
import { PrismaService } from './shared/services/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filters';
import fastifyStatic from '@fastify/static';
import fastifyMultipart from '@fastify/multipart';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const port = appConfig.getPort();
// const port = process.env.PORT || 8080;

// Criar diretórios necessários
const publicDir = join(process.cwd(), 'public');
const uploadsDir = join(publicDir, 'uploads');
const logosDir = join(uploadsDir, 'logos');

if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
  console.log(`[Server] Diretório public criado: ${publicDir}`);
}

if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
  console.log(`[Server] Diretório uploads criado: ${uploadsDir}`);
}

if (!existsSync(logosDir)) {
  mkdirSync(logosDir, { recursive: true });
  console.log(`[Server] Diretório logos criado: ${logosDir}`);
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: 1,
      fields: 10,
    },
    attachFieldsToBody: false,
  });

  await app.register(fastifyStatic, {
    root: join(process.cwd(), 'public'),
    prefix: '/public/',
  });

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [
          `'self'`,
          'data:',
          'validator.swagger.io',
          'localhost:*',
          'http://localhost:*',
        ],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.useGlobalPipes(new ValidationPipe());

  await app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: appConfig.getCorsOrigins(),
    credentials: true,
    exposedHeaders: ['Cross-Origin-Resource-Policy'],
  });

  await app
    .listen(port, '0.0.0.0')
    .then(() => new LoggerService().info(`server listening at port ${port}`));
}

bootstrap();
