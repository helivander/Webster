import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface UploadResult {
  filename: string;
  originalname: string;
  path: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads');
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor() {
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists(): void {
    const dirs = ['logos', 'products', 'templates', 'general'];
    dirs.forEach((dir) => {
      const fullPath = path.join(this.uploadDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  async uploadFile(
    file: UploadedFile,
    folder: string = 'general',
  ): Promise<UploadResult> {
    this.validateFile(file);

    const filename = this.generateFilename(file.originalname);
    const folderPath = path.join(this.uploadDir, folder);
    const filePath = path.join(folderPath, filename);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      filename,
      originalname: file.originalname,
      path: `/public/uploads/${folder}/${filename}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async uploadMultipleFiles(
    files: UploadedFile[],
    folder: string = 'general',
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    for (const file of files) {
      const result = await this.uploadFile(file, folder);
      results.push(result);
    }
    return results;
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      throw new BadRequestException('Erro ao deletar arquivo');
    }
  }

  private validateFile(file: UploadedFile): void {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de arquivo não permitido. Tipos aceitos: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `Arquivo muito grande. Tamanho máximo: ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }
  }

  private generateFilename(originalname: string): string {
    const ext = path.extname(originalname);
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(4).toString('hex');
    return `${timestamp}-${randomBytes}${ext}`;
  }
}
