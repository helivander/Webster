import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  BadRequestException,
  Body,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProdutoUsoService } from './produto-uso.service';
import { JWTAuthGuard } from '../../shared/guards/jwt.guard';
import { CreateProdutoUsoRequestDto } from './dto/request/create-produto-uso.request.dto';
import { UpdateProdutoUsoRequestDto } from './dto/request/update-produto-uso.request.dto';
import { ProdutoUsoResponseDto } from './dto/response/produto-uso.response.dto';

@Controller('produto-uso')
@UseGuards(JWTAuthGuard)
export class ProdutoUsoController {
  constructor(private readonly produtoUsoService: ProdutoUsoService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() produtoUsoData: CreateProdutoUsoRequestDto,
  ): Promise<ProdutoUsoResponseDto> {
    try {
      return await this.produtoUsoService.create(produtoUsoData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao cadastrar produto uso');
    }
  }

  @Get()
  @HttpCode(200)
  findAll(): Promise<ProdutoUsoResponseDto[]> {
    return this.produtoUsoService.findAll();
  }

  @Get('empresa/:empresaId')
  @HttpCode(200)
  findByEmpresa(
    @Param('empresaId', ParseUUIDPipe) empresaId: string,
  ): Promise<ProdutoUsoResponseDto[]> {
    return this.produtoUsoService.findByEmpresa(empresaId);
  }

  @Get('lookup')
  @HttpCode(200)
  findByProdutoAndEmpresa(
    @Query('produtoId', ParseUUIDPipe) produtoId: string,
    @Query('empresaId', ParseUUIDPipe) empresaId: string,
  ): Promise<ProdutoUsoResponseDto | null> {
    return this.produtoUsoService.findByProdutoAndEmpresa(produtoId, empresaId);
  }

  @Get(':id')
  @HttpCode(200)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProdutoUsoResponseDto> {
    return this.produtoUsoService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() produtoUsoData: UpdateProdutoUsoRequestDto,
  ): Promise<ProdutoUsoResponseDto> {
    try {
      return await this.produtoUsoService.update(id, produtoUsoData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar produto uso');
    }
  }

  @Delete(':id')
  @HttpCode(200)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProdutoUsoResponseDto> {
    return this.produtoUsoService.remove(id);
  }
}
