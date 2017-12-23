var mongodb = require('./mongodb');


var history = function () {

};

/**
 * Get history for a specific channel
 * @param channelname
 * @param callback
 */
history.get = function (channelname, callback) {

    mongodb.getData(channelname, function (data) {
        callback(data);
    });

};

/**
 * Save message in history
 * @param channelname
 * @param data
 */
history.save = function (channelname, data) {

    mongodb.save(channelname, data);
};

module.exports = history;