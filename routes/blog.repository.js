var mongo = require('mongodb').MongoClient;
var dotenv = require('dotenv').config();
const url = process.env.MONGODB_CONNECTIONSTRING;
var uuid = require('uuid/v4');

class BlogRepository {


    async getTravels() {
        const client = await this.getClient();
        let coll = client.db('travelblog').collection('journey');
        let resultAsArray = await coll.find({}).toArray();
        return resultAsArray;
    }

    async getHeader(id) {
        const client = await this.getClient();
        let colName = id;
        let coll = client.db('travelblog').collection(colName);
        return await coll.findOne({type:"header"});
    }

    async getEntries(id) {
        const client = await this.getClient();
        let colName = id;
        let coll = client.db('travelblog').collection(colName);
        let resultAsArray = await coll.find({type:"entry"}).toArray();
        return resultAsArray;
    }

    async saveBlogEntry(entry) {
        const client = await this.getClient();
        let colName = entry.blog;
        let coll = client.db('travelblog').collection(colName);
        return coll.insertOne(entry);
    }

    async createTravel(travel) {
        const collUUID = uuid();
        const client = await this.getClient();
        const db = client.db('travelblog');
        const coll = await db.createCollection(collUUID);
        const ok = await coll.insertOne(travel);
        return this.createJourneyEntry(travel, collUUID);
    }

    async createJourneyEntry(travel, uuid) {
        let entry = {
            id: uuid,
            title: travel.title,
            destination: travel.location,
            date: travel.duration,
            length: ''
        }
        const client = await this.getClient();
        const coll = client.db('travelblog').collection('journey');
        const ok = await coll.insertOne(entry);
        return ok.insertedCount
    }



    async getClient() {
        return await mongo.connect(url).catch(err => console.log(err));
    }



}


module.exports = BlogRepository;
