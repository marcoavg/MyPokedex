import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';
// import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
     @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  // private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    //const insertPromisesArray: Promise<Pokemon>[] = [];
    const pokemonInsert: { name: string; no: number }[] = [];
    data.results.forEach(  ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      // const createPokemonDto = { name, no }; 
      // insertPromisesArray.push(
      //   this.pokemonModel.create(createPokemonDto)
      // ); 
      pokemonInsert.push({ name, no });
    });

    try {
      //await Promise.all(insertPromisesArray);
      await this.pokemonModel.insertMany(pokemonInsert);
      return `Seed executed successfully`;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadGatewayException(`El pokemon ${JSON.stringify(error.keyValue )} ya existe en la base de datos`);
      }
      throw new InternalServerErrorException(`Error al crear el pokemon: ${JSON.stringify(error )}`);
    }
    
  }
}
