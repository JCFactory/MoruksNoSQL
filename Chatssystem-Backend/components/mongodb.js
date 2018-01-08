var mongo = require('mongodb').MongoClient;
var messageUtil = require('./message');


const SERVERIP = "mongodb://localhost:27017/rabbitDB";


var mongodb = function () {};

mongodb.db = null;


/**
 * Connect to mongodb
 */
mongodb.connect = function () {
    mongo.connect(SERVERIP, function (err, _db) {
        if(err){
            messageUtil.error("Connection to MongoDB failed");
        } else {
            mongodb.db = _db;
            messageUtil.info("Connetion to MongoDB established");
        }
    });
};


module.exports = mongodb;