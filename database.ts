import { Collection, MongoClient} from "mongodb";
import dotenv from "dotenv";
import { Users} from "./interfaces";
import bcrypt from "bcrypt";
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017"
export const client = new MongoClient(MONGODB_URI);
export const userCollection : Collection<Users> = client.db("PokeAdventures").collection<Users>("users")

const saltRounds : number = 10;

export async function initialUser() {
    if (await userCollection.countDocuments() > 1) {
        return;
    }

    let username : string = "Matthew";
    let password: string = "dummy";
    let currentPokemon: number = 3;
    let ownedPokemons: number[] = [11, 14, 17];
    await userCollection.insertOne({
        username: username,
        password: await bcrypt.hash(password, saltRounds),
        currentPokemon: currentPokemon,
        ownedPokemons: ownedPokemons
    });
}

export async function registerUser(username: string, password: string) {
    try {
        const existingUser = await userCollection.findOne({ username });

        if (existingUser) {
            throw new Error("Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser: Users = {
            username,
            password: hashedPassword,
            currentPokemon: null,
            ownedPokemons: null
        };

        await userCollection.insertOne(newUser);
    } catch (error) {
        throw error;
    }
}

export async function login(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : Users | null = await userCollection.findOne<Users>({username: username});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found")
    }
}

export async function getUsers() {
    return await userCollection.find({}).toArray();
}

async function exit() {
    try {
        await client.close();
        console.log("Connection from database closed");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function loadUsersFromDatabase() {
    const users : Users[] = await getUsers();
    if (users.length === 0) {
        console.log("No users found.");
    }
}

export async function connect() {
    try {
        await client.connect();
        await loadUsersFromDatabase();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}