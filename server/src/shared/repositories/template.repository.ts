import { Injectable } from '@nestjs/common';
import { Template, Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class TemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TemplateUncheckedCreateInput): Promise<Template> {
    return this.prisma.template.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(options?: {
    where?: Prisma.TemplateWhereInput;
    orderBy?: Prisma.TemplateOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }): Promise<Template[]> {
    return this.prisma.template.findMany({
      where: {
        deletedAt: null,
        ...options?.where,
      },
      orderBy: options?.orderBy || { createdAt: 'desc' },
      skip: options?.skip,
      take: options?.take,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Template | null> {
    return this.prisma.template.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async findByAuthorId(authorId: string): Promise<Template[]> {
    return this.prisma.template.findMany({
      where: {
        authorId,
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.TemplateUpdateInput): Promise<Template> {
    return this.prisma.template.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async softDelete(id: string): Promise<Template> {
    return this.prisma.template.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async count(where?: Prisma.TemplateWhereInput): Promise<number> {
    return this.prisma.template.count({
      where: {
        deletedAt: null,
        ...where,
      },
    });
  }
}
