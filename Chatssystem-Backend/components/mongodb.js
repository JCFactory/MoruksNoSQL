var mongo = require('mongodb').MongoClient;
var messageUtil = require('./message');


const SERVERIP = "mongodb://localhost:27017/rabbitDB";

var db;
var collections = {
    General: {},
    Default: {},
    ThaerTube: {}
};

module.exports = {

    /**
     * Connect mongodb
     */
    connect: function () {

        mongo.connect(SERVERIP, function (err, _db) {

            if (err) {

                message.error(err);
            } else {

                db = _db;
                // create collection with same name like message queue
                db.createCollection("General", function (err, res) {
                    if (err) throw err;
                    console.log("Collection General created!");
                });
                db.createCollection("Default", function (err, res) {
                    if (err) throw err;
                    console.log("Collection Default created!");
                });
                db.createCollection("ThaerTube", function (err, res) {
                    if (err) throw err;
                    console.log("Collection Default created!");
                });

                collections.General = db.collection('General');
                collections.Default = db.collection('Default');
                collections.ThaerTube = db.collection('ThaerTube');

            }

        });
    },
    /**
     * Store messages in mongodb
     * @param message
     * @param channel
     */
    storeMessage: function (message, channel, userID) {
        // TODO Wir müssen hier noch den user übergeben... Am besten nur eine userID?

        collections[channel].insert({name: 'Thaer', lname: 'Aldefai', message: message})
    },
    getData: function (channel, callback) {

        this.connect();

        db.collection(channel).find({}).toArray(function (err, result) {
            if (err) {

                messageUtil.error(err);
                callback(err);
            } else {

                callback(result);
            }
        })

    }
};