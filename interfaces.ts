import { ObjectId} from "mongodb";

export interface Users {
    _id?: ObjectId;
    username: string;
    password?: string;
    currentPokemon: number | null;
    ownedPokemons: number[] | null;
}
// types.ts
export interface Stat {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }

  export interface Pokemon {
    id: number;
    name: string;
    sprites: {
      front_default: string;
    };
    stats: Stat[];
    species: {
      url: string;
    };
  }

  export interface EvolutionChain {
    chain: {
      evolves_to: EvolutionChain[];
      species: {
        name: string;
        url: string;
      };
    };
  }
