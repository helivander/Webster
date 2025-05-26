import { PrismaService } from '../services/prisma.service';
import { Marca, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MarcaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MarcaCreateInput): Promise<Marca> {
    return this.prisma.marca.create({
      data,
    });
  }

  async findAll(): Promise<Marca[]> {
    return this.prisma.marca.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findById(id: string): Promise<Marca> {
    return this.prisma.marca.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async update(id: string, data: Prisma.MarcaUpdateInput): Promise<Marca> {
    return this.prisma.marca.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Marca> {
    return this.prisma.marca.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
} 