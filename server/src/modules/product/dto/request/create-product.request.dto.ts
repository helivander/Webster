import {
  IsString,
  IsOptional,
  IsNumber,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateProductRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nome: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descricao?: string;

  @IsOptional()
  @IsNumber()
  preco?: number;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  imagem?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  foto2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  foto3?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  categoria?: string;

  @IsOptional()
  @IsUUID()
  marcaId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  barcode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  codsys?: string;
}
