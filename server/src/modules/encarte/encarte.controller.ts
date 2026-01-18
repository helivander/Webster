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
import { EncarteService } from './encarte.service';
import { JWTAuthGuard } from '../../shared/guards/jwt.guard';
import { HttpUser } from '../../shared/decorators/user.decorator';
import { HttpUserPayload } from '../../shared/types/http-user-payload.type';
import { CreateEncarteRequestDto } from './dto/request/create-encarte.request.dto';
import { UpdateEncarteRequestDto } from './dto/request/update-encarte.request.dto';
import { EncarteResponseDto } from './dto/response/encarte.response.dto';

@Controller('encartes')
@UseGuards(JWTAuthGuard)
export class EncarteController {
  constructor(private readonly encarteService: EncarteService) {}

  @Post()
  @HttpCode(201)
  async create(
    @HttpUser() user: HttpUserPayload,
    @Body() encarteData: CreateEncarteRequestDto,
  ): Promise<EncarteResponseDto> {
    try {
      return await this.encarteService.create(user.id, encarteData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao cadastrar encarte');
    }
  }

  @Get()
  @HttpCode(200)
  findAll(): Promise<EncarteResponseDto[]> {
    return this.encarteService.findAll();
  }

  @Get('my')
  @HttpCode(200)
  findMyEncartes(
    @HttpUser() user: HttpUserPayload,
  ): Promise<EncarteResponseDto[]> {
    return this.encarteService.findByUser(user.id);
  }

  @Get('empresa/:empresaId')
  @HttpCode(200)
  findByEmpresa(
    @Param('empresaId', ParseUUIDPipe) empresaId: string,
  ): Promise<EncarteResponseDto[]> {
    return this.encarteService.findByEmpresa(empresaId);
  }

  @Get(':id')
  @HttpCode(200)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EncarteResponseDto> {
    return this.encarteService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @HttpUser() user: HttpUserPayload,
    @Body() encarteData: UpdateEncarteRequestDto,
  ): Promise<EncarteResponseDto> {
    try {
      return await this.encarteService.update(id, user.id, encarteData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar encarte');
    }
  }

  @Delete(':id')
  @HttpCode(200)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @HttpUser() user: HttpUserPayload,
  ): Promise<EncarteResponseDto> {
    return this.encarteService.remove(id, user.id);
  }
}
