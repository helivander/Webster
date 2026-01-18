import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsObject,
  IsArray,
  ValidateNested,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEncarteItemDto {
  @IsUUID('4', { message: 'O ID do produto deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID do produto é obrigatório' })
  produtoId: string;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @Min(0, { message: 'O valor deve ser maior ou igual a zero' })
  @Type(() => Number)
  valor: number;

  @IsNumber({}, { message: 'O valor promocional deve ser um número' })
  @IsOptional()
  @Min(0, { message: 'O valor promocional deve ser maior ou igual a zero' })
  @Type(() => Number)
  valorPromo?: number;

  @IsNumber({}, { message: 'O valor antigo deve ser um número' })
  @IsOptional()
  @Min(0, { message: 'O valor antigo deve ser maior ou igual a zero' })
  @Type(() => Number)
  valorAntigo?: number;

  @IsString({ message: 'A regra de compra deve ser uma string' })
  @IsOptional()
  regraCompra?: string;

  @IsDateString({}, { message: 'A validade deve ser uma data válida' })
  @IsOptional()
  validadeProd?: string;
}

export class CreateEncarteRequestDto {
  @IsUUID('4', { message: 'O ID do template deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID do template é obrigatório' })
  modelId: string;

  @IsUUID('4', { message: 'O ID da empresa deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID da empresa é obrigatório' })
  empresaId: string;

  @IsObject({ message: 'O JSON do encarte deve ser um objeto' })
  @IsOptional()
  encarteJson?: Record<string, any>;

  @IsString({ message: 'Os avisos devem ser uma string' })
  @IsOptional()
  avisosEncarte?: string;

  @IsArray({ message: 'Os itens devem ser um array' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateEncarteItemDto)
  items?: CreateEncarteItemDto[];
}
