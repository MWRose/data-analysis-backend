import { RiotGameData } from "../../api/riotApi";
import { mongoClientPromise } from "./mongo";


const getRiotData = async () => {
    try {
        const client = await mongoClientPromise;
        const database = client.db("insertDB");
        return database.collection("RiotData");
    } catch (e) {
        console.log('Error connecting to riot data collection', e);
        throw new Error();
    }
}

export const insertDocument = async (doc: RiotGameData) => {
    try {
        const riotData = await getRiotData();
        const result = await riotData.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } catch (e) {
        console.log('Error inserting document', e);
    }
}

export const insertDocuments = async (docs: RiotGameData[]) => {
    try {
        const riotData = await getRiotData();
        const result = await riotData.insertMany(docs);
        console.log(`The documents were inserted with the _ids: ${result.insertedIds}`);
    } catch (e) {
        console.log('Error inserting document', e);
    }
}

export const updateDocument = async (doc: RiotGameData) => {
    try {
        const riotData = await getRiotData();
        const result = await riotData.updateOne({gameId: doc.gameId}, {$set: doc}, {upsert: true})
        return result;
    } catch (e) {
        console.log('Error inserting document', e);
    }
}

export const updateDocuments = async (docs: RiotGameData[]) => {
    try {
        docs.forEach(doc => {
            updateDocument(doc).then(res =>  console.log(`The documents were updated with the _id: ${res?.upsertedId}`));
        }); 
    } catch (e) {
        console.log('Error inserting document', e);
    }
}