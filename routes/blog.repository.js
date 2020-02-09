var mongo = require('mongodb').MongoClient;
var dotenv = require('dotenv').config();
const url = process.env.MONGODB_CONNECTIONSTRING;

class BlogRepositry {


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



    async getClient() {
        return await mongo.connect(url).catch(err => console.log(err));
    }



}


module.exports = BlogRepositry;
