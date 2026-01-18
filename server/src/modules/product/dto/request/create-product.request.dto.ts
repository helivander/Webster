import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUUID,
  MaxLength,
  Min,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductRequestDto {
  @IsUUID('4', { message: 'O ID da marca deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID da marca é obrigatório' })
  marcaId: string;

  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  nome: string;

  @IsNumber({}, { message: 'O preço deve ser um número' })
  @Min(0, { message: 'O preço deve ser maior ou igual a zero' })
  @Type(() => Number)
  preco: number;

  @IsString({ message: 'A descrição deve ser uma string' })
  @IsOptional()
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
  descricao?: string;

  @IsString({ message: 'As tags devem ser uma string' })
  @IsOptional()
  @MaxLength(255, { message: 'As tags devem ter no máximo 255 caracteres' })
  tags?: string;

  @IsString({ message: 'O adicional deve ser uma string' })
  @IsOptional()
  @MaxLength(255, { message: 'O adicional deve ter no máximo 255 caracteres' })
  adicional?: string;

  @IsString({ message: 'A foto1 deve ser uma string' })
  @IsNotEmpty({ message: 'A foto1 é obrigatória' })
  @Matches(/^(https?:\/\/|\/public\/uploads\/).*/, {
    message: 'A foto1 deve ser uma URL válida ou um caminho local válido',
  })
  @MaxLength(400, { message: 'A foto1 deve ter no máximo 400 caracteres' })
  foto1: string;

  @IsString({ message: 'A foto2 deve ser uma string' })
  @IsOptional()
  @Matches(/^(https?:\/\/|\/public\/uploads\/).*/, {
    message: 'A foto2 deve ser uma URL válida ou um caminho local válido',
  })
  @MaxLength(400, { message: 'A foto2 deve ter no máximo 400 caracteres' })
  foto2?: string;

  @IsString({ message: 'A foto3 deve ser uma string' })
  @IsOptional()
  @Matches(/^(https?:\/\/|\/public\/uploads\/).*/, {
    message: 'A foto3 deve ser uma URL válida ou um caminho local válido',
  })
  @MaxLength(400, { message: 'A foto3 deve ter no máximo 400 caracteres' })
  foto3?: string;

  @IsString({ message: 'O tipo deve ser uma string' })
  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  @MaxLength(50, { message: 'O tipo deve ter no máximo 50 caracteres' })
  tipo: string;

  @IsString({ message: 'O barcode deve ser uma string' })
  @IsOptional()
  @MaxLength(50, { message: 'O barcode deve ter no máximo 50 caracteres' })
  barcode?: string;

  @IsString({ message: 'O codsys deve ser uma string' })
  @IsOptional()
  @MaxLength(50, { message: 'O codsys deve ter no máximo 50 caracteres' })
  codsys?: string;

  @IsString({ message: 'A descrição curta deve ser uma string' })
  @IsOptional()
  @MaxLength(150, { message: 'A descrição curta deve ter no máximo 150 caracteres' })
  descricaocurta?: string;
}
