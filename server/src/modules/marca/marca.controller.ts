import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { JWTAuthGuard } from '../../shared/guards';
import { Marca } from '@prisma/client';

@Controller('marcas')
@UseGuards(JWTAuthGuard)
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @Post()
  async create(@Body() createMarcaDto: CreateMarcaDto): Promise<Marca> {
    return this.marcaService.create(createMarcaDto);
  }

  @Get()
  async findAll(): Promise<Marca[]> {
    return this.marcaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Marca> {
    return this.marcaService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMarcaDto: UpdateMarcaDto,
  ): Promise<Marca> {
    return this.marcaService.update(id, updateMarcaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Marca> {
    return this.marcaService.delete(id);
  }
} 