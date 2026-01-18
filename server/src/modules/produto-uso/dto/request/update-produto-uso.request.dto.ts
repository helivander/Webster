import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProdutoUsoRequestDto } from './create-produto-uso.request.dto';

export class UpdateProdutoUsoRequestDto extends PartialType(
  OmitType(CreateProdutoUsoRequestDto, ['produtoId', 'empresaId'] as const),
) {}
