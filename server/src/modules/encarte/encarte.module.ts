import { Module } from '@nestjs/common';
import { EncarteController } from './encarte.controller';
import { EncarteService } from './encarte.service';
import { EncarteRepository } from '../../shared/repositories/encarte.repository';

@Module({
  controllers: [EncarteController],
  providers: [EncarteService, EncarteRepository],
  exports: [EncarteService],
})
export class EncarteModule {}
