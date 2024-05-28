import { ObjectId} from "mongodb";

export interface Users {
    _id?: ObjectId;
    username: string;
    password?: string;
    currentPokemon: number;
    ownedPokemons: number[];
}