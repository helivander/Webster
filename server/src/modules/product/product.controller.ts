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
import { ProductService } from './product.service';
import { JWTAuthGuard } from '../../shared/guards/jwt.guard';
import { HttpUser } from '../../shared/decorators/user.decorator';
import { HttpUserPayload } from '../../shared/types/http-user-payload.type';
import { CreateProductRequestDto } from './dto/request/create-product.request.dto';
import { ProductResponseDto } from './dto/response/product.response.dto';

//controller para o produto
@Controller('products')
@UseGuards(JWTAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //funcao para criar o produto
  @Post()
  @HttpCode(200)
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

  //funcao para pegar todos os produtos
  @Get()
  @HttpCode(200)
  findAll(@HttpUser() user: HttpUserPayload): Promise<ProductResponseDto[]> {
    return this.productService.findAll(user.id);
  }

  //funcao para pegar o produto pelo id
  @Get(':id')
  @HttpCode(200)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @HttpUser() user: HttpUserPayload,
  ): Promise<ProductResponseDto> {
    return this.productService.findOne(id);
  }

  //funcao para atualizar o produto
  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @HttpUser() user: HttpUserPayload,
    @Body() productData: Partial<CreateProductRequestDto>,
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

  //funcao para deletar o produto
  @Delete(':id')
  @HttpCode(200)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @HttpUser() user: HttpUserPayload,
  ): Promise<ProductResponseDto> {
    return this.productService.remove(id);
  }
} 