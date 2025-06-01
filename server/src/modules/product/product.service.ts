import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { CreateProductRequestDto } from './dto/request/create-product.request.dto';
import { ProductResponseDto } from './dto/response/product.response.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    data: CreateProductRequestDto,
  ): Promise<ProductResponseDto> {
    let marcaId = data.marcaId;

    // Se não foi fornecido marcaId, busca uma marca padrão ou cria uma
    if (!marcaId) {
      let marca = await this.prisma.marca.findFirst({
        where: { nome: 'Padrão' },
      });

      if (!marca) {
        marca = await this.prisma.marca.create({
          data: {
            nome: 'Padrão',
            descricao: 'Marca padrão para produtos',
          },
        });
      }
      marcaId = marca.id;
    }

    const produto = await this.prisma.produto.create({
      data: {
        marcaId,
        nome: data.nome,
        preco: data.preco || 0,
        descricao: data.descricao,
        foto1: data.imagem || '',
        foto2: data.foto2,
        foto3: data.foto3,
        tipo: 'PRODUTO',
        tags: data.categoria,
        barcode: data.barcode,
        codsys: data.codsys,
      },
      include: {
        marca: true,
      },
    });

    return this.mapToResponseDto(produto);
  }

  async findAll(userId: string): Promise<ProductResponseDto[]> {
    const produtos = await this.prisma.produto.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        marca: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return produtos.map((produto) => this.mapToResponseDto(produto));
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        marca: true,
      },
    });

    if (!produto || produto.deletedAt) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.mapToResponseDto(produto);
  }

  async update(
    id: string,
    data: Partial<CreateProductRequestDto>,
  ): Promise<ProductResponseDto> {
    const existingProduct = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!existingProduct || existingProduct.deletedAt) {
      throw new NotFoundException('Produto não encontrado');
    }

    const updateData: any = {};

    if (data.nome) updateData.nome = data.nome;
    if (data.preco !== undefined) updateData.preco = data.preco;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.imagem !== undefined) updateData.foto1 = data.imagem;
    if (data.foto2 !== undefined) updateData.foto2 = data.foto2;
    if (data.foto3 !== undefined) updateData.foto3 = data.foto3;
    if (data.categoria !== undefined) updateData.tags = data.categoria;
    if (data.marcaId !== undefined) updateData.marcaId = data.marcaId;
    if (data.barcode !== undefined) updateData.barcode = data.barcode;
    if (data.codsys !== undefined) updateData.codsys = data.codsys;

    const produto = await this.prisma.produto.update({
      where: { id },
      data: updateData,
      include: {
        marca: true,
      },
    });

    return this.mapToResponseDto(produto);
  }

  async remove(id: string): Promise<ProductResponseDto> {
    const existingProduct = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!existingProduct || existingProduct.deletedAt) {
      throw new NotFoundException('Produto não encontrado');
    }

    const produto = await this.prisma.produto.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        marca: true,
      },
    });

    return this.mapToResponseDto(produto);
  }

  private mapToResponseDto(produto: any): ProductResponseDto {
    return {
      id: produto.id,
      nome: produto.nome,
      imagem: produto.foto1,
      foto2: produto.foto2,
      foto3: produto.foto3,
      descricao: produto.descricao,
      preco: produto.preco ? Number(produto.preco) : null,
      categoria: produto.tags,
      marcaId: produto.marcaId,
      barcode: produto.barcode,
      codsys: produto.codsys,
      marca: produto.marca
        ? {
            id: produto.marca.id,
            nome: produto.marca.nome,
            logo: produto.marca.logo,
          }
        : null,
      createdAt: produto.createdAt.toISOString(),
      updatedAt: produto.updatedAt.toISOString(),
      deletedAt: produto.deletedAt?.toISOString() || null,
    };
  }
}
