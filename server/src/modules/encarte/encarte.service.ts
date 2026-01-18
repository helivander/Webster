import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { EncarteRepository } from '../../shared/repositories/encarte.repository';
import { CreateEncarteRequestDto } from './dto/request/create-encarte.request.dto';
import { UpdateEncarteRequestDto } from './dto/request/update-encarte.request.dto';
import { EncarteResponseDto } from './dto/response/encarte.response.dto';

@Injectable()
export class EncarteService {
  constructor(private readonly encarteRepository: EncarteRepository) {}

  async create(
    userId: string,
    createEncarteDto: CreateEncarteRequestDto,
  ): Promise<EncarteResponseDto> {
    const encarte = await this.encarteRepository.create({
      userId,
      modelId: createEncarteDto.modelId,
      empresaId: createEncarteDto.empresaId,
      encarteJson: createEncarteDto.encarteJson,
      avisosEncarte: createEncarteDto.avisosEncarte,
    });

    // Criar os itens do encarte se fornecidos
    if (createEncarteDto.items && createEncarteDto.items.length > 0) {
      const itemsData = createEncarteDto.items.map((item) => ({
        produtoId: item.produtoId,
        projetoId: encarte.id,
        valor: item.valor,
        valorPromo: item.valorPromo,
        valorAntigo: item.valorAntigo,
        regraCompra: item.regraCompra,
        validadeProd: item.validadeProd ? new Date(item.validadeProd) : undefined,
      }));

      await this.encarteRepository.createManyItems(itemsData);

      // Buscar o encarte atualizado com os itens
      const updatedEncarte = await this.encarteRepository.findById(encarte.id);
      return new EncarteResponseDto(updatedEncarte);
    }

    return new EncarteResponseDto(encarte);
  }

  async findAll(): Promise<EncarteResponseDto[]> {
    const encartes = await this.encarteRepository.findAll();
    return encartes.map((encarte) => new EncarteResponseDto(encarte));
  }

  async findOne(id: string): Promise<EncarteResponseDto> {
    const encarte = await this.encarteRepository.findById(id);
    if (!encarte) {
      throw new NotFoundException(`Encarte com ID ${id} não encontrado`);
    }
    return new EncarteResponseDto(encarte);
  }

  async findByUser(userId: string): Promise<EncarteResponseDto[]> {
    const encartes = await this.encarteRepository.findByUserId(userId);
    return encartes.map((encarte) => new EncarteResponseDto(encarte));
  }

  async findByEmpresa(empresaId: string): Promise<EncarteResponseDto[]> {
    const encartes = await this.encarteRepository.findByEmpresaId(empresaId);
    return encartes.map((encarte) => new EncarteResponseDto(encarte));
  }

  async update(
    id: string,
    userId: string,
    updateEncarteDto: UpdateEncarteRequestDto,
  ): Promise<EncarteResponseDto> {
    const existingEncarte = await this.encarteRepository.findById(id);
    if (!existingEncarte) {
      throw new NotFoundException(`Encarte com ID ${id} não encontrado`);
    }

    if (existingEncarte.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este encarte',
      );
    }

    // Atualizar os itens se fornecidos
    if (updateEncarteDto.items) {
      // Remover itens antigos
      await this.encarteRepository.deleteItemsByEncarteId(id);

      // Criar novos itens
      if (updateEncarteDto.items.length > 0) {
        const itemsData = updateEncarteDto.items.map((item) => ({
          produtoId: item.produtoId,
          projetoId: id,
          valor: item.valor,
          valorPromo: item.valorPromo,
          valorAntigo: item.valorAntigo,
          regraCompra: item.regraCompra,
          validadeProd: item.validadeProd ? new Date(item.validadeProd) : undefined,
        }));

        await this.encarteRepository.createManyItems(itemsData);
      }
    }

    const { items, ...updateData } = updateEncarteDto;
    const encarte = await this.encarteRepository.update(id, updateData);
    return new EncarteResponseDto(encarte);
  }

  async remove(id: string, userId: string): Promise<EncarteResponseDto> {
    const existingEncarte = await this.encarteRepository.findById(id);
    if (!existingEncarte) {
      throw new NotFoundException(`Encarte com ID ${id} não encontrado`);
    }

    if (existingEncarte.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para remover este encarte',
      );
    }

    // Soft delete dos itens
    await this.encarteRepository.deleteItemsByEncarteId(id);

    const encarte = await this.encarteRepository.softDelete(id);
    return new EncarteResponseDto(encarte);
  }
}
