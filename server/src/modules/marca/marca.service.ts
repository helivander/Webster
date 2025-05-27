import { Injectable, NotFoundException } from '@nestjs/common';
import { MarcaRepository } from '../../shared/repositories/marca.repository';
import { Marca } from '@prisma/client';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Injectable()
export class MarcaService {
  constructor(private readonly marcaRepository: MarcaRepository) {}

  async create(createMarcaDto: CreateMarcaDto): Promise<Marca> {
    return this.marcaRepository.create(createMarcaDto);
  }

  async findAll(): Promise<Marca[]> {
    return this.marcaRepository.findAll();
  }

  async findById(id: string): Promise<Marca> {
    const marca = await this.marcaRepository.findById(id);
    if (!marca) {
      throw new NotFoundException(`Marca com ID ${id} não encontrada`);
    }
    return marca;
  }

  async update(id: string, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
    await this.findById(id); // Verifica se existe
    return this.marcaRepository.update(id, updateMarcaDto);
  }

  async delete(id: string): Promise<Marca> {
    await this.findById(id); // Verifica se existe
    return this.marcaRepository.softDelete(id);
  }
}
