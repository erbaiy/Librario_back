import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  publicationYear: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()  // Changed from IsString to IsBoolean
  @IsOptional()
  available: boolean;
}
