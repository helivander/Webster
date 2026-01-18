import { Decimal } from '@prisma/client/runtime/library';

export class ProdutoUsoResponseDto {
  id: string;
  produtoId: string;
  empresaId: string;
  ultimoValor: Decimal | number;
  ultimoPreco: Decimal | number;
  descPerson?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  // Relacionamentos opcionais
  produto?: {
    id: string;
    nome: string;
    foto1: string;
    marca?: {
      id: string;
      nome: string;
    };
  };

  empresa?: {
    id: string;
    name: string;
  };

  constructor(partial: Partial<ProdutoUsoResponseDto>) {
    Object.assign(this, partial);
    // Converter Decimal para number
    if (this.ultimoValor && typeof this.ultimoValor !== 'number') {
      this.ultimoValor = Number(this.ultimoValor);
    }
    if (this.ultimoPreco && typeof this.ultimoPreco !== 'number') {
      this.ultimoPreco = Number(this.ultimoPreco);
    }
  }
}
