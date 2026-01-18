import { Decimal } from '@prisma/client/runtime/library';

export class ProductResponseDto {
  id: string;
  marcaId: string;
  nome: string;
  preco: Decimal | number;
  descricao?: string;
  tags?: string;
  adicional?: string;
  foto1: string;
  foto2?: string;
  foto3?: string;
  tipo: string;
  barcode?: string;
  codsys?: string;
  descricaocurta?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  // Relacionamento opcional
  marca?: {
    id: string;
    nome: string;
    logo?: string;
  };

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
    // Converter Decimal para number se necessário
    if (this.preco && typeof this.preco !== 'number') {
      this.preco = Number(this.preco);
    }
  }
}
