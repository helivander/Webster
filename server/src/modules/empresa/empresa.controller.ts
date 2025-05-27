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
import { Empresa } from './entities/empresa.entity';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

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

  @Get('minha')
  @UseGuards(JWTAuthGuard)
  async findMinhaEmpresa(
    @Req() req: AuthenticatedRequest,
  ): Promise<Empresa | null> {
    const usuarioId = req.user.id;
    const empresa = await this.empresaService.findByUsuarioId(usuarioId);
    if (!empresa) {
      return null;
    }
    return empresa;
  }

  @Get()
  findAll() {
    return this.empresaService.findAll();
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const usuarioId = req.user.id;
    return this.empresaService.findOne(id, usuarioId);
  }

  @Patch(':id')
  @UseGuards(JWTAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const usuarioId = req.user.id;
    return this.empresaService.update(id, updateEmpresaDto, usuarioId);
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const usuarioId = req.user.id;
    return this.empresaService.remove(id, usuarioId);
  }
}
