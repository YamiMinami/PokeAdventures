import { Users } from "./interfaces";
import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://estalistrinev:tPqvaqEIdP7z9KM1@mijnproject.udzcq5y.mongodb.net/?retryWrites=true&w=majority&appName=mijnProject"
const client = new MongoClient(uri);

export async function main() {
    const uri = "mongodb+srv://estalistrinev:tPqvaqEIdP7z9KM1@mijnproject.udzcq5y.mongodb.net/?retryWrites=true&w=majority&appName=mijnProject"
    const client = new MongoClient(uri);
  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();

export function userId {

}