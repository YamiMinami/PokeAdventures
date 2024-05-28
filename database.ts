import { Collection, MongoClient} from "mongodb";
import dotenv from "dotenv";
import { Users} from "./interfaces";
dotenv.config();

export const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
export const collection : Collection<Users> = client.db("PokeAdventures").collection<Users>("users")

export async function getUsers() {
    return await collection.find({}).toArray();
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