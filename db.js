const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const dbname = "crud_mongodb";
const url = "mongodb://localhost:27017";
const mongoOptions = {newUrlParser: true}; //just some mongoDB options

const state = {
    db: null            //means by default we dont have a database yet
};

const connect = (callbackfn) => {
    if (state.db)
        callbackfn();   //if there is a DB, call callback
    else {              //if not, then make a connection (with error handling)
        MongoClient.connect(url,mongoOptions,(err,client) => {
            if (err)
                callbackfn(err);
            else {
                state.db = client.db(dbname);
                callbackfn();
            }
        });
    }
}

const getPrimaryKey = (_id) => { //pass in the ID of document to get the primary key
    return ObjectID(_id); //ObjectID is function to search for the _id 
}

const getDB = () => {
    return state.db;
}

//this line makes such that these functions are able to be called from outside
//from any file that require('db.js')
module.exports = {getDB,connect,getPrimaryKey};



