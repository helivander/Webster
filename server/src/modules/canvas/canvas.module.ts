import { Module } from '@nestjs/common';
import { CanvasController } from './canvas.controller';
import { CanvasService } from './canvas.service';
import { CanvasRepository } from '../../shared/repositories/canvas.repository';

@Module({
  controllers: [CanvasController],
  providers: [CanvasService, CanvasRepository],
})
export class CanvasModule {}
