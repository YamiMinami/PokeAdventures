import { MONGODB_URI} from "./database";
import session, { MemoryStore} from "express-session";
import { Users} from "./interfaces";
import mongoDbSession from "connect-mongodb-session"
const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions",
    databaseName: "login-express"
});

declare module 'express-session' {
    export interface SessionData {
        username?: Users
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
})