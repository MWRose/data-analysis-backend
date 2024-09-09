import { MongoClient } from "mongodb";
import { ENVVARS } from "../../util/envvars";

const getMongoClientPromise = () => {
        const mongoUri = `mongodb://${ENVVARS.MONGO_URL}:27017/`;
        const mongoClient: MongoClient = new MongoClient(mongoUri);
        return mongoClient.connect();
}

export const mongoClientPromise: Promise<MongoClient> = getMongoClientPromise();

export async function getMongoHealthcheck() {
    try {
        const mongoClient: MongoClient = await mongoClientPromise;
        const stats = await mongoClient.db().stats();
        stats.status = stats.ok === 1 ? "OK" : "ERROR";
        return stats;
    } catch (e) {
        console.log(e);
        return;
    }
}

export async function listDatabases(client: MongoClient) {
    const databasesList = await client.db().admin().listDatabases();

    return databasesList.databases.map(db => db.name);
};