import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductRepository } from '../../shared/repositories/product.repository';
import { CreateProductRequestDto } from './dto/request/create-product.request.dto';
import { UpdateProductRequestDto } from './dto/request/update-product.request.dto';
import { ProductResponseDto } from './dto/response/product.response.dto';
import { Produto } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(
    userId: string,
    createProductDto: CreateProductRequestDto,
  ): Promise<ProductResponseDto> {
    // Verificar se já existe produto com o mesmo barcode
    if (createProductDto.barcode) {
      const existingProduct = await this.productRepository.findByBarcode(
        createProductDto.barcode,
      );
      if (existingProduct) {
        throw new BadRequestException(
          'Já existe um produto com este código de barras',
        );
      }
    }

    const produto = await this.productRepository.create({
      marcaId: createProductDto.marcaId,
      nome: createProductDto.nome,
      preco: createProductDto.preco,
      descricao: createProductDto.descricao,
      tags: createProductDto.tags,
      adicional: createProductDto.adicional,
      foto1: createProductDto.foto1,
      foto2: createProductDto.foto2,
      foto3: createProductDto.foto3,
      tipo: createProductDto.tipo,
      barcode: createProductDto.barcode,
      codsys: createProductDto.codsys,
      descricaocurta: createProductDto.descricaocurta,
    });

    return new ProductResponseDto(produto);
  }

  async findAll(userId: string): Promise<ProductResponseDto[]> {
    const produtos = await this.productRepository.findAll();
    return produtos.map((produto) => new ProductResponseDto(produto));
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const produto = await this.productRepository.findById(id);
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return new ProductResponseDto(produto);
  }

  async findByMarca(marcaId: string): Promise<ProductResponseDto[]> {
    const produtos = await this.productRepository.findByMarcaId(marcaId);
    return produtos.map((produto) => new ProductResponseDto(produto));
  }

  async search(query: string): Promise<ProductResponseDto[]> {
    const produtos = await this.productRepository.search(query);
    return produtos.map((produto) => new ProductResponseDto(produto));
  }

  async update(
    id: string,
    updateProductDto: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    // Verificar se o novo barcode já existe em outro produto
    if (
      updateProductDto.barcode &&
      updateProductDto.barcode !== existingProduct.barcode
    ) {
      const productWithBarcode = await this.productRepository.findByBarcode(
        updateProductDto.barcode,
      );
      if (productWithBarcode && productWithBarcode.id !== id) {
        throw new BadRequestException(
          'Já existe um produto com este código de barras',
        );
      }
    }

    const produto = await this.productRepository.update(id, updateProductDto);
    return new ProductResponseDto(produto);
  }

  async remove(id: string): Promise<ProductResponseDto> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    const produto = await this.productRepository.softDelete(id);
    return new ProductResponseDto(produto);
  }
}
