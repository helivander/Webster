// client/src/types/empresa.ts
export interface Empresa {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  logo?: string | null;
  description?: string | null;
  usuarioId: string;
  createdAt: string; // ou Date
  updatedAt: string; // ou Date
  deletedAt?: string | null;
}

export interface CreateEmpresaArg {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  logo?: string; // Assumindo que será uma URL string
  description?: string;
} 