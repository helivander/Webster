import { Module } from '@nestjs/common';
import { ProdutoUsoController } from './produto-uso.controller';
import { ProdutoUsoService } from './produto-uso.service';
import { ProdutoUsoRepository } from '../../shared/repositories/produto-uso.repository';

@Module({
  controllers: [ProdutoUsoController],
  providers: [ProdutoUsoService, ProdutoUsoRepository],
  exports: [ProdutoUsoService],
})
export class ProdutoUsoModule {}
