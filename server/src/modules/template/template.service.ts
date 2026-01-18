import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TemplateRepository } from '../../shared/repositories/template.repository';
import { CreateTemplateRequestDto } from './dto/request/create-template.request.dto';
import { UpdateTemplateRequestDto } from './dto/request/update-template.request.dto';
import { TemplateResponseDto } from './dto/response/template.response.dto';
import { TipoMidia } from '@prisma/client';

@Injectable()
export class TemplateService {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async create(
    authorId: string,
    createTemplateDto: CreateTemplateRequestDto,
  ): Promise<TemplateResponseDto> {
    const template = await this.templateRepository.create({
      nome: createTemplateDto.nome,
      largura: createTemplateDto.largura,
      altura: createTemplateDto.altura,
      quantImagem: createTemplateDto.quantImagem || 1,
      imgFundo: createTemplateDto.imgFundo,
      fonte: createTemplateDto.fonte,
      textoCabecalho: createTemplateDto.textoCabecalho,
      textoRodape: createTemplateDto.textoRodape,
      midia: createTemplateDto.midia as TipoMidia,
      dpi: createTemplateDto.dpi,
      authorId,
      description: createTemplateDto.description,
      conteudoJson: createTemplateDto.conteudoJson,
      carimboPreco: createTemplateDto.carimboPreco,
      carimboTituloProd: createTemplateDto.carimboTituloProd,
    });

    return new TemplateResponseDto(template);
  }

  async findAll(): Promise<TemplateResponseDto[]> {
    const templates = await this.templateRepository.findAll();
    return templates.map((template) => new TemplateResponseDto(template));
  }

  async findOne(id: string): Promise<TemplateResponseDto> {
    const template = await this.templateRepository.findById(id);
    if (!template) {
      throw new NotFoundException(`Template com ID ${id} não encontrado`);
    }
    return new TemplateResponseDto(template);
  }

  async findByAuthor(authorId: string): Promise<TemplateResponseDto[]> {
    const templates = await this.templateRepository.findByAuthorId(authorId);
    return templates.map((template) => new TemplateResponseDto(template));
  }

  async update(
    id: string,
    authorId: string,
    updateTemplateDto: UpdateTemplateRequestDto,
  ): Promise<TemplateResponseDto> {
    const existingTemplate = await this.templateRepository.findById(id);
    if (!existingTemplate) {
      throw new NotFoundException(`Template com ID ${id} não encontrado`);
    }

    if (existingTemplate.authorId !== authorId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este template',
      );
    }

    const updateData: any = { ...updateTemplateDto };
    if (updateTemplateDto.midia) {
      updateData.midia = updateTemplateDto.midia as TipoMidia;
    }

    const template = await this.templateRepository.update(id, updateData);
    return new TemplateResponseDto(template);
  }

  async remove(id: string, authorId: string): Promise<TemplateResponseDto> {
    const existingTemplate = await this.templateRepository.findById(id);
    if (!existingTemplate) {
      throw new NotFoundException(`Template com ID ${id} não encontrado`);
    }

    if (existingTemplate.authorId !== authorId) {
      throw new ForbiddenException(
        'Você não tem permissão para remover este template',
      );
    }

    const template = await this.templateRepository.softDelete(id);
    return new TemplateResponseDto(template);
  }
}
