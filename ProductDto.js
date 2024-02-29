import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
    _id?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    ean: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    categories: string[];

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;
}
