import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateEncarteRequestDto } from './create-encarte.request.dto';

export class UpdateEncarteRequestDto extends PartialType(
  OmitType(CreateEncarteRequestDto, ['modelId', 'empresaId'] as const),
) {}
