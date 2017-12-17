var mongo = require('mongodb').MongoClient;
var messageUtil = require('./message');


const SERVERIP = "mongodb://localhost:27017/rabbitDB";

var db;
var collections = {
    General: {},
    Default: {},
    ThaerTube: {},
    Custom: {},
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

                // // create collection with same name like message queue
                // db.createCollection("General", function (err, res) {
                //     if (err) throw err;
                //     console.log("Collection General created!");
                // });
                // db.createCollection("Default", function (err, res) {
                //     if (err) throw err;
                //     console.log("Collection Default created!");
                // });
                // db.createCollection("ThaerTube", function (err, res) {
                //     if (err) throw err;
                //     console.log("Collection ThaerTube created!");
                // });


                console.log("Customize your collection!");
                var stdin = process.openStdin();
                stdin.addListener("data", function (d) {
                        db.createCollection(d.toString(), function (err, res) {
                            if (err) throw err;
                            collections.Custom = db.collection(d.toString());
                            console.log("Collection " + d.toString().trim() + " created!"); 
                        });
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
     * @param user
     */
    storeMessage: function (message, channel, user) {

        collections[channel].insert({
            user: user,
            message: message,
            date: new Date().getTime()
        })
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