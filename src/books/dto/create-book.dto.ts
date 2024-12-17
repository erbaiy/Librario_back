import { IsString, IsBoolean, IsNotEmpty, MinLength } from 'class-validator';

export class CreateBookDto {
    @IsString()
    @IsNotEmpty({ message: 'Title cannot be empty' })
    @MinLength(2, { message: 'Title must be at least 2 characters' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Author cannot be empty' })
    @MinLength(2, { message: 'Author must be at least 2 characters' })
    author: string;

    @IsString()
    @IsNotEmpty({ message: 'Category cannot be empty' })
    category: string;

    @IsBoolean()
    available: boolean = true;
}
