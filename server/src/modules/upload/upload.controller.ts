import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService, UploadResult } from './upload.service';
import { JWTAuthGuard } from '../../shared/guards/jwt.guard';

@Controller('upload')
@UseGuards(JWTAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
    return this.uploadService.uploadFile(file, folder || 'general');
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
    return this.uploadService.uploadMultipleFiles(files, folder || 'general');
  }

  @Post('logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
    return this.uploadService.uploadFile(file, 'logos');
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
    return this.uploadService.uploadFile(file, 'products');
  }

  @Post('template')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTemplateImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
    return this.uploadService.uploadFile(file, 'templates');
  }

  @Delete()
  async deleteFile(@Query('path') filePath: string): Promise<{ success: boolean }> {
    if (!filePath) {
      throw new BadRequestException('Caminho do arquivo não informado');
    }
    const success = await this.uploadService.deleteFile(filePath);
    return { success };
  }
}
