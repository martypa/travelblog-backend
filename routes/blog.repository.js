var mongo = require('mongodb').MongoClient;
var dotenv = require('dotenv').config();
const url = process.env.MONGODB_CONNECTIONSTRING;

class BlogRepository {


    async getTravels() {
        const client = await this.getClient();
        let coll = client.db('travelblog').collection('journey');
        let resultAsArray = await coll.find({}).toArray();
        return resultAsArray;
    }

    async getHeader(id) {
        const client = await this.getClient();
        let colName = 'blog-' + id;
        let coll = client.db('travelblog').collection(colName);
        return await coll.findOne({type:"header"});
    }

    async getEntries(id) {
        const client = await this.getClient();
        let colName = 'blog-' + id;
        let coll = client.db('travelblog').collection(colName);
        let resultAsArray = await coll.find({type:"entry"}).toArray();
        return resultAsArray;
    }

    async saveBlogEntry(entry) {
        const client = await this.getClient();
        let colName = 'blog-' + entry.blog;
        let coll = client.db('travelblog').collection(colName);
        return coll.insertOne(entry);
    }



    async getClient() {
        return await mongo.connect(url).catch(err => console.log(err));
    }



}


module.exports = BlogRepository;
