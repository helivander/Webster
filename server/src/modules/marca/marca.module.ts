import { Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { MarcaRepository } from '../../shared/repositories/marca.repository';

@Module({
  controllers: [MarcaController],
  providers: [MarcaService, MarcaRepository],
  exports: [MarcaService],
})
export class MarcaModule {}
