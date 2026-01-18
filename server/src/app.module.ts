import { Module } from '@nestjs/common';
import { LoggerModule } from './modules/logger/logger.module';
import { LoggerService } from './modules/logger/logger.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CanvasModule } from './modules/canvas/canvas.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { MarcaModule } from './modules/marca/marca.module';
import { ProductModule } from './modules/product/product.module';
import { TemplateModule } from './modules/template/template.module';
import { EncarteModule } from './modules/encarte/encarte.module';
import { ProdutoUsoModule } from './modules/produto-uso/produto-uso.module';
import { UploadModule } from './modules/upload/upload.module';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    LoggerModule,
    UserModule,
    CanvasModule,
    EmpresaModule,
    MarcaModule,
    ProductModule,
    TemplateModule,
    EncarteModule,
    ProdutoUsoModule,
    UploadModule,
  ],
  providers: [LoggerService],
})
export class AppModule {}
