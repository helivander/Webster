import { Injectable } from '@nestjs/common';
import { ProdutoUso, Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ProdutoUsoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProdutoUsoUncheckedCreateInput): Promise<ProdutoUso> {
    return this.prisma.produtoUso.create({
      data,
      include: {
        produto: {
          include: {
            marca: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        empresa: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(options?: {
    where?: Prisma.ProdutoUsoWhereInput;
    orderBy?: Prisma.ProdutoUsoOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }): Promise<ProdutoUso[]> {
    return this.prisma.produtoUso.findMany({
      where: {
        deletedAt: null,
        ...options?.where,
      },
      orderBy: options?.orderBy || { updatedAt: 'desc' },
      skip: options?.skip,
      take: options?.take,
      include: {
        produto: {
          include: {
            marca: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        empresa: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<ProdutoUso | null> {
    return this.prisma.produtoUso.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        produto: {
          include: {
            marca: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        empresa: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByProdutoAndEmpresa(
    produtoId: string,
    empresaId: string,
  ): Promise<ProdutoUso | null> {
    return this.prisma.produtoUso.findFirst({
      where: {
        produtoId,
        empresaId,
        deletedAt: null,
      },
      include: {
        produto: {
          include: {
            marca: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        empresa: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByEmpresaId(empresaId: string): Promise<ProdutoUso[]> {
    return this.prisma.produtoUso.findMany({
      where: {
        empresaId,
        deletedAt: null,
      },
      include: {
        produto: {
          include: {
            marca: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ProdutoUsoUpdateInput): Promise<ProdutoUso> {
    return this.prisma.produtoUso.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        produto: {
          include: {
            marca: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        empresa: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async upsert(
    produtoId: string,
    empresaId: string,
    data: Omit<Prisma.ProdutoUsoUncheckedCreateInput, 'produtoId' | 'empresaId'>,
  ): Promise<ProdutoUso> {
    const existing = await this.findByProdutoAndEmpresa(produtoId, empresaId);

    if (existing) {
      return this.update(existing.id, data);
    }

    return this.create({
      produtoId,
      empresaId,
      ...data,
    });
  }

  async softDelete(id: string): Promise<ProdutoUso> {
    return this.prisma.produtoUso.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async count(where?: Prisma.ProdutoUsoWhereInput): Promise<number> {
    return this.prisma.produtoUso.count({
      where: {
        deletedAt: null,
        ...where,
      },
    });
  }
}
