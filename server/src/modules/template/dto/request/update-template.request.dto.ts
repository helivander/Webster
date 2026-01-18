import { PartialType } from '@nestjs/mapped-types';
import { CreateTemplateRequestDto } from './create-template.request.dto';

export class UpdateTemplateRequestDto extends PartialType(CreateTemplateRequestDto) {}
