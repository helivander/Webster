import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateMarcaDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  nome: string;

  @IsString({ message: 'O logo deve ser uma string' })
  @IsOptional()
  @Matches(/^(https?:\/\/|\/public\/uploads\/logos\/).*/, {
    message: 'O logo deve ser uma URL válida ou um caminho local válido',
  })
  @MaxLength(400, { message: 'O logo deve ter no máximo 400 caracteres' })
  logo?: string;

  @IsString({ message: 'A descrição deve ser uma string' })
  @IsOptional()
  @MaxLength(255, { message: 'A descrição deve ter no máximo 255 caracteres' })
  descricao?: string;
}
