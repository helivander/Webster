export interface Produto {
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

export interface CreateProdutoArg {
  nome: string;
  imagem?: string;
  foto2?: string;
  foto3?: string;
  descricao?: string;
  preco?: number;
  categoria?: string;
  marcaId?: string;
  barcode?: string;
  codsys?: string;
}

export interface UpdateProdutoArg extends CreateProdutoArg {
  id: string;
} 