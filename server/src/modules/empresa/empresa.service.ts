import { Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { PrismaService } from '../../shared/services/prisma.service';
import { Empresa } from '@prisma/client';

@Injectable()
export class EmpresaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createEmpresaDto: CreateEmpresaDto,
    usuarioId: string,
  ): Promise<Empresa> {
    return this.prisma.empresa.create({
      data: {
        ...createEmpresaDto,
        usuarioId,
      },
    });
  }

  findAll() {
    return `This action returns all empresa`;
  }

  findOne(id: string) {
    return `This action returns a #${id} empresa`;
  }

  update(id: string, updateEmpresaDto: UpdateEmpresaDto) {
    return `This action updates a #${id} empresa`;
  }

  remove(id: string) {
    return `This action removes a #${id} empresa`;
  }
}
