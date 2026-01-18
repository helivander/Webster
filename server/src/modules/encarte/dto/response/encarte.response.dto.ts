import { Decimal } from '@prisma/client/runtime/library';

export class EncarteItemResponseDto {
  id: string;
  produtoId: string;
  projetoId: string;
  valor: Decimal | number;
  valorPromo?: Decimal | number;
  valorAntigo?: Decimal | number;
  regraCompra?: string;
  validadeProd?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relacionamento opcional
  produto?: {
    id: string;
    nome: string;
    foto1: string;
    marca?: {
      id: string;
      nome: string;
    };
  };

  constructor(partial: Partial<EncarteItemResponseDto>) {
    Object.assign(this, partial);
    // Converter Decimal para number
    if (this.valor && typeof this.valor !== 'number') {
      this.valor = Number(this.valor);
    }
    if (this.valorPromo && typeof this.valorPromo !== 'number') {
      this.valorPromo = Number(this.valorPromo);
    }
    if (this.valorAntigo && typeof this.valorAntigo !== 'number') {
      this.valorAntigo = Number(this.valorAntigo);
    }
  }
}

export class EncarteResponseDto {
  id: string;
  userId: string;
  modelId: string;
  empresaId: string;
  encarteJson?: Record<string, any>;
  avisosEncarte?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  // Relacionamentos opcionais
  user?: {
    id: string;
    username: string;
    email: string;
  };

  template?: {
    id: string;
    nome: string;
    largura: number;
    altura: number;
  };

  empresa?: {
    id: string;
    name: string;
    logo?: string;
  };

  encarteItems?: EncarteItemResponseDto[];

  constructor(partial: Partial<EncarteResponseDto>) {
    Object.assign(this, partial);
    if (this.encarteItems) {
      this.encarteItems = this.encarteItems.map(
        (item) => new EncarteItemResponseDto(item),
      );
    }
  }
}
