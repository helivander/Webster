import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  BadRequestException,
  Body,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { JWTAuthGuard } from '../../shared/guards/jwt.guard';
import { HttpUser } from '../../shared/decorators/user.decorator';
import { HttpUserPayload } from '../../shared/types/http-user-payload.type';
import { CreateTemplateRequestDto } from './dto/request/create-template.request.dto';
import { UpdateTemplateRequestDto } from './dto/request/update-template.request.dto';
import { TemplateResponseDto } from './dto/response/template.response.dto';

@Controller('templates')
@UseGuards(JWTAuthGuard)
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @HttpCode(201)
  async create(
    @HttpUser() user: HttpUserPayload,
    @Body() templateData: CreateTemplateRequestDto,
  ): Promise<TemplateResponseDto> {
    try {
      return await this.templateService.create(user.id, templateData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao cadastrar template');
    }
  }

  @Get()
  @HttpCode(200)
  findAll(): Promise<TemplateResponseDto[]> {
    return this.templateService.findAll();
  }

  @Get('my')
  @HttpCode(200)
  findMyTemplates(
    @HttpUser() user: HttpUserPayload,
  ): Promise<TemplateResponseDto[]> {
    return this.templateService.findByAuthor(user.id);
  }

  @Get(':id')
  @HttpCode(200)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TemplateResponseDto> {
    return this.templateService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @HttpUser() user: HttpUserPayload,
    @Body() templateData: UpdateTemplateRequestDto,
  ): Promise<TemplateResponseDto> {
    try {
      return await this.templateService.update(id, user.id, templateData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar template');
    }
  }

  @Delete(':id')
  @HttpCode(200)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @HttpUser() user: HttpUserPayload,
  ): Promise<TemplateResponseDto> {
    return this.templateService.remove(id, user.id);
  }
}
