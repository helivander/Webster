import { TipoMidia } from '@prisma/client';

export class TemplateResponseDto {
  id: string;
  nome: string;
  largura: number;
  altura: number;
  quantImagem: number;
  imgFundo?: string;
  fonte?: string;
  textoCabecalho?: string;
  textoRodape?: string;
  midia: TipoMidia;
  dpi?: number;
  authorId: string;
  description?: string;
  conteudoJson?: Record<string, any>;
  carimboPreco?: string;
  carimboTituloProd?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  // Relacionamento opcional
  author?: {
    id: string;
    username: string;
    email: string;
  };

  constructor(partial: Partial<TemplateResponseDto>) {
    Object.assign(this, partial);
  }
}
