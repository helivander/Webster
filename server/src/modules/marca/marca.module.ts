import { Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { MarcaRepository } from '../../shared/repositories/marca.repository';
import { PrismaService } from '../../shared/services/prisma.service';

@Module({
  controllers: [MarcaController],
  providers: [MarcaService, MarcaRepository, PrismaService],
  exports: [MarcaService],
})
export class MarcaModule {} 