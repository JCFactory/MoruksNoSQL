var mongodb = require('./mongodb');


var history = function () {

};

/**
 * Get history for a specific channel
 * @param channelname
 * @param callback
 */
history.get = function (channelname, callback) {

    mongodb.db.collection(channelname).find({}).toArray(function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(result);
        }
    });

};

/**
 * Save message in history
 * @param channelname
 * @param data
 */
history.save = function (channelname, data) {

    mongodb.db.collection(channelname).insertOne(data, function (err, res) {
        if (err) {
            throw err;
        } else {
            console.log("1 document inserted");
        }
    });

};

module.exports = history;