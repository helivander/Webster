import { Injectable } from '@nestjs/common';
import { Encarte, EncarteItem, Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class EncarteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EncarteUncheckedCreateInput): Promise<Encarte> {
    return this.prisma.encarte.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        template: {
          select: {
            id: true,
            nome: true,
            largura: true,
            altura: true,
          },
        },
        empresa: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        encarteItems: {
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
        },
      },
    });
  }

  async findAll(options?: {
    where?: Prisma.EncarteWhereInput;
    orderBy?: Prisma.EncarteOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }): Promise<Encarte[]> {
    return this.prisma.encarte.findMany({
      where: {
        deletedAt: null,
        ...options?.where,
      },
      orderBy: options?.orderBy || { createdAt: 'desc' },
      skip: options?.skip,
      take: options?.take,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        template: {
          select: {
            id: true,
            nome: true,
            largura: true,
            altura: true,
          },
        },
        empresa: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        encarteItems: {
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
        },
      },
    });
  }

  async findById(id: string): Promise<Encarte | null> {
    return this.prisma.encarte.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        template: {
          select: {
            id: true,
            nome: true,
            largura: true,
            altura: true,
          },
        },
        empresa: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        encarteItems: {
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
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<Encarte[]> {
    return this.prisma.encarte.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        template: {
          select: {
            id: true,
            nome: true,
            largura: true,
            altura: true,
          },
        },
        empresa: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        encarteItems: true,
      },
    });
  }

  async findByEmpresaId(empresaId: string): Promise<Encarte[]> {
    return this.prisma.encarte.findMany({
      where: {
        empresaId,
        deletedAt: null,
      },
      include: {
        template: {
          select: {
            id: true,
            nome: true,
            largura: true,
            altura: true,
          },
        },
        encarteItems: true,
      },
    });
  }

  async update(id: string, data: Prisma.EncarteUpdateInput): Promise<Encarte> {
    return this.prisma.encarte.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        template: {
          select: {
            id: true,
            nome: true,
            largura: true,
            altura: true,
          },
        },
        empresa: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        encarteItems: {
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
        },
      },
    });
  }

  async softDelete(id: string): Promise<Encarte> {
    return this.prisma.encarte.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // Métodos para EncarteItem
  async createItem(
    data: Prisma.EncarteItemUncheckedCreateInput,
  ): Promise<EncarteItem> {
    return this.prisma.encarteItem.create({
      data,
      include: {
        produto: {
          include: {
            marca: true,
          },
        },
      },
    });
  }

  async createManyItems(
    items: Prisma.EncarteItemUncheckedCreateInput[],
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.encarteItem.createMany({
      data: items,
    });
  }

  async deleteItemsByEncarteId(encarteId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.encarteItem.updateMany({
      where: { projetoId: encarteId },
      data: { deletedAt: new Date() },
    });
  }

  async count(where?: Prisma.EncarteWhereInput): Promise<number> {
    return this.prisma.encarte.count({
      where: {
        deletedAt: null,
        ...where,
      },
    });
  }
}
