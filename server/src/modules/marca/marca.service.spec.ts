import { Test, TestingModule } from '@nestjs/testing';
import { MarcaService } from './marca.service';
import { MarcaRepository } from '../../shared/repositories/marca.repository';
import { NotFoundException } from '@nestjs/common';

describe('MarcaService', () => {
  let service: MarcaService;
  let repository: MarcaRepository;

  const mockMarca = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    nome: 'Marca Teste',
    logo: 'https://exemplo.com/logo.png',
    descricao: 'Descrição da marca teste',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarcaService,
        {
          provide: MarcaRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MarcaService>(MarcaService);
    repository = module.get<MarcaRepository>(MarcaRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a marca', async () => {
      mockRepository.create.mockResolvedValue(mockMarca);

      const result = await service.create({
        nome: mockMarca.nome,
        logo: mockMarca.logo,
        descricao: mockMarca.descricao,
      });

      expect(result).toEqual(mockMarca);
      expect(mockRepository.create).toHaveBeenCalledWith({
        nome: mockMarca.nome,
        logo: mockMarca.logo,
        descricao: mockMarca.descricao,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of marcas', async () => {
      mockRepository.findAll.mockResolvedValue([mockMarca]);

      const result = await service.findAll();

      expect(result).toEqual([mockMarca]);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a marca', async () => {
      mockRepository.findById.mockResolvedValue(mockMarca);

      const result = await service.findById(mockMarca.id);

      expect(result).toEqual(mockMarca);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockMarca.id);
    });

    it('should throw NotFoundException when marca not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a marca', async () => {
      const updateData = {
        nome: 'Marca Atualizada',
        descricao: 'Nova descrição',
      };

      mockRepository.findById.mockResolvedValue(mockMarca);
      mockRepository.update.mockResolvedValue({ ...mockMarca, ...updateData });

      const result = await service.update(mockMarca.id, updateData);

      expect(result).toEqual({ ...mockMarca, ...updateData });
      expect(mockRepository.update).toHaveBeenCalledWith(
        mockMarca.id,
        updateData,
      );
    });

    it('should throw NotFoundException when updating non-existent marca', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { nome: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft delete a marca', async () => {
      const deletedAt = new Date();
      const deletedMarca = { ...mockMarca, deletedAt };

      mockRepository.findById.mockResolvedValue(mockMarca);
      mockRepository.softDelete.mockResolvedValue(deletedMarca);

      const result = await service.delete(mockMarca.id);

      expect(result).toEqual(deletedMarca);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(mockMarca.id);
    });

    it('should throw NotFoundException when deleting non-existent marca', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
