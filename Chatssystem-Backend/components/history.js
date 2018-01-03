var mongodb = require('./mongodb');

const GENERAL = "General";
const DEFAULT = "Default";

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
        }
    });

};

/**
 * Mark message as read => read: true
 * @param data
 * @param owner
 */
history.markAsRead = function (data, owner) {

    var receiver = data.message.receiver;
    var sender = data.message.data.sender;
    var message = data.message.data.message;
    var date = data.message.data.date;
    var channelName = data.message.name;


    var search = {
        message: message,
        date: date
    };

    var replace = {$set: {read: true}};

    // Mark messages in group chat
    if (channelName === DEFAULT || channelName === GENERAL) {

        mongodb.db.collection(owner + '-' + channelName).updateOne(search, replace, function (err, res) {
            if (err) {
                throw err;
            }
        });

    } else {

        // Mark messages in private chat
        var colName1 = receiver + '-' + sender;
        var colName2 = sender + '-' + receiver;

        mongodb.db.collection(colName1).updateOne(search, replace, function (err, res) {
            if (err) {
                throw err;
            }
        });

        mongodb.db.collection(colName2).updateOne(search, replace, function (err, res) {
            if (err) {
                throw err;
            }
        });

    }

};

module.exports = history;