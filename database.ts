import { Collection, MongoClient} from "mongodb";
import dotenv from "dotenv";
import { Users} from "./interfaces";
import bcrypt from "bcrypt";
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017"
export const client = new MongoClient(MONGODB_URI);
export const userCollection : Collection<Users> = client.db("PokeAdventures").collection<Users>("users")

const saltRounds : number = 10;

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