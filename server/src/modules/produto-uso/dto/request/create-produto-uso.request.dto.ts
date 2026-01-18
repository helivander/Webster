import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProdutoUsoRequestDto {
  @IsUUID('4', { message: 'O ID do produto deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID do produto é obrigatório' })
  produtoId: string;

  @IsUUID('4', { message: 'O ID da empresa deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID da empresa é obrigatório' })
  empresaId: string;

  @IsNumber({}, { message: 'O último valor deve ser um número' })
  @Min(0, { message: 'O último valor deve ser maior ou igual a zero' })
  @Type(() => Number)
  ultimoValor: number;

  @IsNumber({}, { message: 'O último preço deve ser um número' })
  @Min(0, { message: 'O último preço deve ser maior ou igual a zero' })
  @Type(() => Number)
  ultimoPreco: number;

  @IsString({ message: 'A descrição personalizada deve ser uma string' })
  @IsOptional()
  @MaxLength(255, { message: 'A descrição personalizada deve ter no máximo 255 caracteres' })
  descPerson?: string;
}
