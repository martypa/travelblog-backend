var mongo = require('mongodb').MongoClient;
var dotenv = require('dotenv').config();
const url = process.env.MONGODB_CONNECTIONSTRING;

class UserRepository{

    async getUser(username){
        const client = await this.getClient();
        let coll = client.db('travelblog').collection('user');
        return coll.findOne({username: username});
    }


    async getClient() {
        return await mongo.connect(url).catch(err => console.log(err));
    }
}

module.exports = UserRepository;
