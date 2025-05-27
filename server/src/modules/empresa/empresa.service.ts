import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
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
    const existingEmpresa = await this.prisma.empresa.findFirst({
      where: { usuarioId, deletedAt: null },
    });
    if (existingEmpresa) {
      throw new ForbiddenException('Usuário já possui uma empresa cadastrada.');
    }
    return this.prisma.empresa.create({
      data: {
        ...createEmpresaDto,
        usuarioId,
      },
    });
  }

  async findByUsuarioId(usuarioId: string): Promise<Empresa | null> {
    return this.prisma.empresa.findFirst({
      where: {
        usuarioId,
        deletedAt: null,
      },
    });
  }

  findAll() {
    return `This action returns all empresa`;
  }

  async findOne(id: string, usuarioId: string): Promise<Empresa> {
    const empresa = await this.prisma.empresa.findFirst({
      where: { id, deletedAt: null },
    });
    if (!empresa) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada.`);
    }
    return empresa;
  }

  async update(
    id: string,
    updateEmpresaDto: UpdateEmpresaDto,
    usuarioId: string,
  ): Promise<Empresa> {
    const empresaToUpdate = await this.prisma.empresa.findFirst({
      where: { id, deletedAt: null },
    });

    if (!empresaToUpdate) {
      throw new NotFoundException(
        `Empresa com ID ${id} não encontrada para atualização.`,
      );
    }

    if (empresaToUpdate.usuarioId !== usuarioId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esta empresa.',
      );
    }

    return this.prisma.empresa.update({
      where: { id },
      data: updateEmpresaDto,
    });
  }

  async remove(id: string, usuarioId: string): Promise<Empresa> {
    const empresaToRemove = await this.prisma.empresa.findFirst({
      where: { id, deletedAt: null },
    });

    if (!empresaToRemove) {
      throw new NotFoundException(
        `Empresa com ID ${id} não encontrada para remoção.`,
      );
    }

    if (empresaToRemove.usuarioId !== usuarioId) {
      throw new ForbiddenException(
        'Você não tem permissão para remover esta empresa.',
      );
    }

    return this.prisma.empresa.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
