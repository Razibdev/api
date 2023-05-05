const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback) =>{
    // MongoClient.connect(
    //   "mongodb+srv://razibhossen8566:Razib121159mna@cluster0.h00dxpn.mongodb.net/nodejs_complete?retryWrites=true&w=majority"
    // )
    MongoClient.connect("mongodb://localhost:27017")

      .then((client) => {
        console.log("Connected");
        _db = client.db("nodejs_complete");
        callback(client);
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
};

const getDb = () =>{
  if(_db){
    return _db;
  }
  throw 'No database found'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

