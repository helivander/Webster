export class ProductResponseDto {
  id: string;
  nome: string;
  imagem?: string | null;
  foto2?: string | null;
  foto3?: string | null;
  descricao?: string | null;
  preco?: number | null;
  categoria?: string | null;
  marcaId?: string | null;
  barcode?: string | null;
  codsys?: string | null;
  marca?: {
    id: string;
    nome: string;
    logo?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
