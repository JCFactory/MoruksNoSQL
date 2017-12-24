var mongodb = require('./mongodb');
var rabbitmq = require('./rabbitmq');

var chat = function () {

};


chat.createGroupChat = function (owner, groupname) {


    var checkData = {
        owner: owner,
        participant: groupname
    };

    mongodb.db.collection("Chats").find(checkData).toArray(function (err, result) {
        if(err) {
            throw err;
        } else {
            if(result.length > 0) {
                console.log("Group Chat already exists");
            } else {

                mongodb.db.createCollection(owner + '-' + groupname, function (err, res) {

                    if (err) {
                        throw err;
                    } else {

                        var data = {
                            owner: owner,
                            participant: groupname,
                            exchange: groupname,
                            date: new Date().getTime()
                        };

                        // Add the chat into "Chats" collection
                        mongodb.db.collection("Chats").insertOne(data, function (err, res) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("Chat created");
                            }
                        });

                        rabbitmq.initGroupChat(owner, groupname);
                        //callback(true);
                    }

                });

            }
        }
    });



};

/**
 * Create chat
 * @param owner
 * @param participant
 */
chat.create = function (owner, participant, callback) {

    // Example: owner = inan, participant = steffen
    // Create two collections
    // Collection 1 => inan-steffen => History of inan
    // Collection 2 => steffen-inan => History of steffen

    mongodb.db.createCollection(owner + '-' + participant, function (err, res) { // Create history collection of owner

        if (err) {
            throw err;
        } else {
            mongodb.db.createCollection(participant + '-' + owner, function (err, res) { // History collection of participant
                if (err) {
                    throw err;
                } else {

                    var data = {
                        owner: owner,
                        participant: participant,
                        exchange: owner + '-' + participant,
                        date: new Date().getTime()
                    };

                    var data2 = {
                        owner: participant,
                        participant: owner,
                        exchange: owner + '-' + participant,
                        date: new Date().getTime()
                    };

                    // Add the chat into "Chats" collection
                    mongodb.db.collection("Chats").insertMany([data, data2], function (err, res) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("Chat created");
                        }
                    });

                    // Create Exchange and insert the two queues => 1 queur for 1 user;
                    rabbitmq.initChat(owner, participant);
                    callback(true);
                }
            });
        }


    });


};

/**
 * Get Chatlist by username
 * @param username
 * @param callback
 */
chat.getByUsername = function (username, callback) {

    mongodb.db.collection("Chats").find({owner: username}).toArray(function (err, result) {
        if (err) {
            callback(err);
        } else {

            callback(result);
        }
    })
};


chat.alreadyExist = function (owner, participant, callback) {


    var data = {
        owner: owner,
        participant: participant
    };

    var data2 = {
        owner: participant,
        participant: owner
    };


    mongodb.db.collection("Chats").find({$or: [data, data2]}).toArray(function (err, result) {
        if (err) {
            //callback(err);
            throw err;
        } else {
            if (result.length > 0) {
                callback(true);
            } else {
                callback(false);
            }
        }
    });
};


chat.getExchangeName = function (owner, participant, callback) {

    var data = {
        owner: owner,
        participant: participant
    };

    var data2 = {
        owner: participant,
        participant: owner
    };

    mongodb.db.collection("Chats").find({$or: [data, data2]}).toArray(function (err, result) {
        if (err) {
            //callback(err);
            throw err;
        } else {
            if (result.length > 0) {
                callback(result[0].exchange);
            } else {
                callback(null);
            }
        }
    });
};

module.exports = chat;