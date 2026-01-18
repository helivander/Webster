import { Injectable } from '@nestjs/common';
import { Produto, Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProdutoUncheckedCreateInput): Promise<Produto> {
    return this.prisma.produto.create({
      data,
      include: {
        marca: true,
      },
    });
  }

  async findAll(options?: {
    where?: Prisma.ProdutoWhereInput;
    orderBy?: Prisma.ProdutoOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }): Promise<Produto[]> {
    return this.prisma.produto.findMany({
      where: {
        deletedAt: null,
        ...options?.where,
      },
      orderBy: options?.orderBy || { createdAt: 'desc' },
      skip: options?.skip,
      take: options?.take,
      include: {
        marca: true,
      },
    });
  }

  async findById(id: string): Promise<Produto | null> {
    return this.prisma.produto.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        marca: true,
      },
    });
  }

  async findByBarcode(barcode: string): Promise<Produto | null> {
    return this.prisma.produto.findFirst({
      where: {
        barcode,
        deletedAt: null,
      },
      include: {
        marca: true,
      },
    });
  }

  async findByMarcaId(marcaId: string): Promise<Produto[]> {
    return this.prisma.produto.findMany({
      where: {
        marcaId,
        deletedAt: null,
      },
      include: {
        marca: true,
      },
    });
  }

  async update(id: string, data: Prisma.ProdutoUpdateInput): Promise<Produto> {
    return this.prisma.produto.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        marca: true,
      },
    });
  }

  async softDelete(id: string): Promise<Produto> {
    return this.prisma.produto.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async count(where?: Prisma.ProdutoWhereInput): Promise<number> {
    return this.prisma.produto.count({
      where: {
        deletedAt: null,
        ...where,
      },
    });
  }

  async search(query: string): Promise<Produto[]> {
    return this.prisma.produto.findMany({
      where: {
        deletedAt: null,
        OR: [
          { nome: { contains: query, mode: 'insensitive' } },
          { descricao: { contains: query, mode: 'insensitive' } },
          { barcode: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        marca: true,
      },
    });
  }
}
