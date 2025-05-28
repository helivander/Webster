import { Module } from '@nestjs/common';
import { LoggerModule } from './modules/logger/logger.module';
import { LoggerService } from './modules/logger/logger.service';
// import { PrismaService } from './shared/services/prisma.service'; // Comentado ou removido
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CanvasModule } from './modules/canvas/canvas.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { MarcaModule } from './modules/marca/marca.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UploadModule } from './modules/upload/upload.module';
// import { UploadController } from './modules/upload.controller'; // Remover esta linha

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    LoggerModule,
    UserModule,
    CanvasModule,
    EmpresaModule,
    MarcaModule,
    UploadModule,
  ],
  providers: [LoggerService],
  // controllers: [UploadController], // Remover UploadController daqui
})
export class AppModule {}
