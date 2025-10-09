import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { validate as isUUID } from 'uuid';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly appConfig: ConfigService
  ) {
    this.defaultLimit = this.appConfig.get<number>('defaultLimit') ?? 10;
  }

  async create(createPokemonDto: CreatePokemonDto) {
    if (createPokemonDto.name.length < 3) {
      return 'El nombre del pokemon es muy corto';
    }
    if (createPokemonDto.no <= 0) {
      return 'El numero del pokemon debe ser mayor a 0';
    }

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadGatewayException(`El pokemon ${JSON.stringify(error.keyValue )} ya existe en la base de datos`);
      }
      throw new InternalServerErrorException(`Error al crear el pokemon: ${JSON.stringify(error )}`);
    }
  }

  findAll(pagination: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = pagination;
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(value: string) {
    let pokemon: Pokemon | null = null;
    if (!isNaN(+value)) {
      // buscar por no
      pokemon = await this.pokemonModel.findOne({ no: value });
    }

    if(!pokemon && isValidObjectId(value)){
      // buscar por mongoId
      pokemon = await this.pokemonModel.findById(value);
    } 

    if(!pokemon){
      const regex = new RegExp(`^${value}$`, 'i');
      // buscar por name
      pokemon = await this.pokemonModel.findOne( { name: regex });
    }


    if(!pokemon)
      throw new BadGatewayException(`El pokemon con id o no "${value}" no se encuentra en la base de datos`);

    return pokemon;
  }

  async update(value: string, updatePokemonDto: UpdatePokemonDto) {
    let pokemon = await this.findOne(value);
    if (!pokemon) throw new BadGatewayException(`El pokemon con id o no "${value}" no se encuentra en la base de datos`);

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadGatewayException(`El pokemon ${JSON.stringify(error.keyValue )} ya existe en la base de datos`);
      }
      throw new InternalServerErrorException(`Error al actualizar el pokemon: ${JSON.stringify(error)}`);
    }
  }

  async remove(value: string) {
    // let pokemon = await this.findOne(value);
    // if (!pokemon) throw new BadGatewayException(`El pokemon con id o no "${value}" no se encuentra en la base de datos`);
    // await pokemon.deleteOne();
    // return { message: `El pokemon con id o no "${value}" ha sido eliminado` };
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: value });
    if (deletedCount === 0) {
      throw new BadGatewayException(`El pokemon con id "${value}" no se encuentra en la base de datos`);
    }else{
      return { message: `El pokemon con id "${value}" ha sido eliminado` };  
    }
  }
}
