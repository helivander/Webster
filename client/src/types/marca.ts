// client/src/types/marca.ts
export interface Marca {
  id: string;
  nome: string;
  logo?: string | null;
  descricao?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateMarcaArg {
  nome: string;
  logo?: string;
  descricao?: string;
}

export interface UpdateMarcaArg extends CreateMarcaArg {
  id: string;
} 