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
import { ValidationPipe } from './shared/pipes';
import { AllExceptionsFilter } from './shared/filters';
import fastifyStatic from '@fastify/static';
import fastifyMultipart from '@fastify/multipart';
import { join } from 'path';

const port = appConfig.getPort();
// const port = process.env.PORT || 8080;
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyMultipart, {
    // attachFieldsToBody: true,
  });

  await app.register(fastifyStatic, {
    root: join(__dirname, 'public'),
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
    origin: [process.env.CLIENT_URL, 'http://localhost:3000'],
    credentials: true,
    exposedHeaders: ['Cross-Origin-Resource-Policy'],
  });

  await app
    .listen(port, '0.0.0.0')
    .then(() => new LoggerService().info(`server listening at port ${port}`));
}

bootstrap();
