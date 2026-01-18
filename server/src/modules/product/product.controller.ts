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
import { ProductService } from './product.service';
import { JWTAuthGuard } from '../../shared/guards/jwt.guard';
import { HttpUser } from '../../shared/decorators/user.decorator';
import { HttpUserPayload } from '../../shared/types/http-user-payload.type';
import { CreateProductRequestDto } from './dto/request/create-product.request.dto';
import { UpdateProductRequestDto } from './dto/request/update-product.request.dto';
import { ProductResponseDto } from './dto/response/product.response.dto';

@Controller('products')
@UseGuards(JWTAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(201)
  async create(
    @HttpUser() user: HttpUserPayload,
    @Body() productData: CreateProductRequestDto,
  ): Promise<ProductResponseDto> {
    try {
      return await this.productService.create(user.id, productData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao cadastrar produto');
    }
  }

  @Get()
  @HttpCode(200)
  findAll(@HttpUser() user: HttpUserPayload): Promise<ProductResponseDto[]> {
    return this.productService.findAll(user.id);
  }

  @Get('search')
  @HttpCode(200)
  search(@Query('q') query: string): Promise<ProductResponseDto[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Query de busca é obrigatória');
    }
    return this.productService.search(query);
  }

  @Get('marca/:marcaId')
  @HttpCode(200)
  findByMarca(
    @Param('marcaId', ParseUUIDPipe) marcaId: string,
  ): Promise<ProductResponseDto[]> {
    return this.productService.findByMarca(marcaId);
  }

  @Get(':id')
  @HttpCode(200)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @HttpUser() user: HttpUserPayload,
  ): Promise<ProductResponseDto> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @HttpUser() user: HttpUserPayload,
    @Body() productData: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    try {
      return await this.productService.update(id, productData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar produto');
    }
  }

  @Delete(':id')
  @HttpCode(200)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @HttpUser() user: HttpUserPayload,
  ): Promise<ProductResponseDto> {
    return this.productService.remove(id);
  }
}
