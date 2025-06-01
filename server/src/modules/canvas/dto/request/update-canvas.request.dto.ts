import { CreateCanvasRequestDto } from './create-canvas.request.dto';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateCanvasRequestDto implements CreateCanvasRequestDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  content: string;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;
}
