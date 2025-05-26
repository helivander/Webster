import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(14) // Geralmente CNPJ tem 14 dígitos
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  logo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  // usuarioId será adicionado pelo serviço, não esperado do cliente diretamente.
  // @IsUUID()
  // @IsNotEmpty()
  // usuarioId: string;
}
