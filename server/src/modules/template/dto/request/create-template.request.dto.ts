import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsObject,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoMidiaEnum {
  D = 'D', // Digital
  I = 'I', // Impresso
  V = 'V', // Video
}

export class CreateTemplateRequestDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  nome: string;

  @IsNumber({}, { message: 'A largura deve ser um número' })
  @Min(1, { message: 'A largura deve ser maior que zero' })
  @Type(() => Number)
  largura: number;

  @IsNumber({}, { message: 'A altura deve ser um número' })
  @Min(1, { message: 'A altura deve ser maior que zero' })
  @Type(() => Number)
  altura: number;

  @IsNumber({}, { message: 'A quantidade de imagens deve ser um número' })
  @IsOptional()
  @Min(1, { message: 'A quantidade de imagens deve ser pelo menos 1' })
  @Type(() => Number)
  quantImagem?: number;

  @IsString({ message: 'A imagem de fundo deve ser uma string' })
  @IsOptional()
  @MaxLength(400, { message: 'A imagem de fundo deve ter no máximo 400 caracteres' })
  imgFundo?: string;

  @IsString({ message: 'A fonte deve ser uma string' })
  @IsOptional()
  @MaxLength(100, { message: 'A fonte deve ter no máximo 100 caracteres' })
  fonte?: string;

  @IsString({ message: 'O texto do cabeçalho deve ser uma string' })
  @IsOptional()
  @MaxLength(500, { message: 'O texto do cabeçalho deve ter no máximo 500 caracteres' })
  textoCabecalho?: string;

  @IsString({ message: 'O texto do rodapé deve ser uma string' })
  @IsOptional()
  @MaxLength(500, { message: 'O texto do rodapé deve ter no máximo 500 caracteres' })
  textoRodape?: string;

  @IsEnum(TipoMidiaEnum, { message: 'O tipo de mídia deve ser D, I ou V' })
  @IsNotEmpty({ message: 'O tipo de mídia é obrigatório' })
  midia: TipoMidiaEnum;

  @IsNumber({}, { message: 'O DPI deve ser um número' })
  @IsOptional()
  @Min(72, { message: 'O DPI deve ser pelo menos 72' })
  @Type(() => Number)
  dpi?: number;

  @IsString({ message: 'A descrição deve ser uma string' })
  @IsOptional()
  @MaxLength(255, { message: 'A descrição deve ter no máximo 255 caracteres' })
  description?: string;

  @IsObject({ message: 'O conteúdo JSON deve ser um objeto' })
  @IsOptional()
  conteudoJson?: Record<string, any>;

  @IsString({ message: 'O carimbo de preço deve ser uma string' })
  @IsOptional()
  @MaxLength(100, { message: 'O carimbo de preço deve ter no máximo 100 caracteres' })
  carimboPreco?: string;

  @IsString({ message: 'O carimbo de título do produto deve ser uma string' })
  @IsOptional()
  @MaxLength(100, { message: 'O carimbo de título do produto deve ter no máximo 100 caracteres' })
  carimboTituloProd?: string;
}
