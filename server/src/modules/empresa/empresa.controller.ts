import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { JWTAuthGuard } from '../../shared/guards';
import { Request } from 'express';

interface AuthenticatedUser {
  id: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  create(
    @Body() createEmpresaDto: CreateEmpresaDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const usuarioId = req.user.id;
    return this.empresaService.create(createEmpresaDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.empresaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empresaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JWTAuthGuard)
  update(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresaService.update(id, updateEmpresaDto);
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  remove(@Param('id') id: string) {
    return this.empresaService.remove(id);
  }
}
