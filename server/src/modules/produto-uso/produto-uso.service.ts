import { Injectable, NotFoundException } from '@nestjs/common';
import { ProdutoUsoRepository } from '../../shared/repositories/produto-uso.repository';
import { CreateProdutoUsoRequestDto } from './dto/request/create-produto-uso.request.dto';
import { UpdateProdutoUsoRequestDto } from './dto/request/update-produto-uso.request.dto';
import { ProdutoUsoResponseDto } from './dto/response/produto-uso.response.dto';

@Injectable()
export class ProdutoUsoService {
  constructor(private readonly produtoUsoRepository: ProdutoUsoRepository) {}

  async create(
    createProdutoUsoDto: CreateProdutoUsoRequestDto,
  ): Promise<ProdutoUsoResponseDto> {
    // Usar upsert para criar ou atualizar
    const produtoUso = await this.produtoUsoRepository.upsert(
      createProdutoUsoDto.produtoId,
      createProdutoUsoDto.empresaId,
      {
        ultimoValor: createProdutoUsoDto.ultimoValor,
        ultimoPreco: createProdutoUsoDto.ultimoPreco,
        descPerson: createProdutoUsoDto.descPerson,
      },
    );

    return new ProdutoUsoResponseDto(produtoUso);
  }

  async findAll(): Promise<ProdutoUsoResponseDto[]> {
    const produtoUsos = await this.produtoUsoRepository.findAll();
    return produtoUsos.map((pu) => new ProdutoUsoResponseDto(pu));
  }

  async findOne(id: string): Promise<ProdutoUsoResponseDto> {
    const produtoUso = await this.produtoUsoRepository.findById(id);
    if (!produtoUso) {
      throw new NotFoundException(`ProdutoUso com ID ${id} não encontrado`);
    }
    return new ProdutoUsoResponseDto(produtoUso);
  }

  async findByEmpresa(empresaId: string): Promise<ProdutoUsoResponseDto[]> {
    const produtoUsos = await this.produtoUsoRepository.findByEmpresaId(empresaId);
    return produtoUsos.map((pu) => new ProdutoUsoResponseDto(pu));
  }

  async findByProdutoAndEmpresa(
    produtoId: string,
    empresaId: string,
  ): Promise<ProdutoUsoResponseDto | null> {
    const produtoUso = await this.produtoUsoRepository.findByProdutoAndEmpresa(
      produtoId,
      empresaId,
    );
    if (!produtoUso) {
      return null;
    }
    return new ProdutoUsoResponseDto(produtoUso);
  }

  async update(
    id: string,
    updateProdutoUsoDto: UpdateProdutoUsoRequestDto,
  ): Promise<ProdutoUsoResponseDto> {
    const existingProdutoUso = await this.produtoUsoRepository.findById(id);
    if (!existingProdutoUso) {
      throw new NotFoundException(`ProdutoUso com ID ${id} não encontrado`);
    }

    const produtoUso = await this.produtoUsoRepository.update(
      id,
      updateProdutoUsoDto,
    );
    return new ProdutoUsoResponseDto(produtoUso);
  }

  async remove(id: string): Promise<ProdutoUsoResponseDto> {
    const existingProdutoUso = await this.produtoUsoRepository.findById(id);
    if (!existingProdutoUso) {
      throw new NotFoundException(`ProdutoUso com ID ${id} não encontrado`);
    }

    const produtoUso = await this.produtoUsoRepository.softDelete(id);
    return new ProdutoUsoResponseDto(produtoUso);
  }
}
