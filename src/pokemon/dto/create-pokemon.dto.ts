import {  IsNotEmpty, IsNumber, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    readonly name: string;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    @Min(1)
    readonly no: number;
}
