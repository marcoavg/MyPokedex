import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    console.log(pagination);
    return this.pokemonService.findAll(pagination);
  }

  @Get(':value')
  findOne(@Param('value') value: string) {
    return this.pokemonService.findOne(value);
  }

  @Patch(':value')
  update(@Param('value') value: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(value, updatePokemonDto);
  }

  @Delete(':value')
  remove(@Param('value', ParseMongoIdPipe) value: string) {
    return this.pokemonService.remove(value);
  }
}
