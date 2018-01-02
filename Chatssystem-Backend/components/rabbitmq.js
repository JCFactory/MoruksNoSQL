var amqp = require('amqplib/callback_api');
var mongodb = require('./mongodb');
var messageUtil = require('./message');
var history = require('../components/history');

const SERVERIP = "amqp://localhost";
const EXCHANGE = "NoSQL-Chat";

module.exports = {

    /**
     * Send message to a channel
     * @param channel
     * @param message
     */
    sendMessageToChannel: function (channel, message, user, callback) {

        console.log(channel + ' ' + message + ' ' + user);

        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {

                ch.assertExchange(channel, 'fanout', {durable: true});

                var data = {
                    sender: user,
                    message: message,
                    date: new Date().getTime()
                };

                ch.publish(channel, '', new Buffer(JSON.stringify(data)));
                messageUtil.info("Sent:" + channel + " " + message + " " + user);
                callback()
            });


        });

        //mongodb.storeMessage(message, channel, user);
    },
    /**
     * Receive a message and store this in mongodb (Group Chat) Default and General...
     */
    receiveMessagesFromChannel: function (channelName, username) {


        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {


                ch.assertExchange(EXCHANGE, 'fanout', {durable: true});

                ch.assertQueue(channelName, {exclusive: false}, function (err, q) {
                    messageUtil.info("Waiting for messages. To exit press CTRL+C");
                    ch.bindQueue(q.queue, EXCHANGE, channelName);


                    ch.consume(q.queue, function (msg) {

                        // mongodb.storeMessage(msg.content.toString(), channelName);
                        messageUtil.info(username + " received a message  '" + channelName + "': " + msg.content.toString());
                    }, {consumerTag: username, noAck: false});

                });
            });
        });
    },
    initGroupChat: function (owner, groupname) {

        const exchangeName = groupname; // Channelname

        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {


                ch.assertExchange(exchangeName, 'fanout', {durable: true});


                ch.assertQueue(owner + '-' + groupname, {exclusive: false}, function (err, q) {

                    ch.bindQueue(q.queue, exchangeName, '');
                    messageUtil.info("Initalize Queue " + exchangeName + " for user: " + owner);
                });


            });
        });

    },
    /**
     * Wird beim starten/initalisieren der Chats genutzt... (Privat Chat)
     * @param owner
     * @param participant
     */
    initChat: function (owner, participant) {

        const exchangeName = owner + '-' + participant;

        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {


                ch.assertExchange(exchangeName, 'fanout', {durable: true});

                ch.assertQueue(owner + '-' + participant, {exclusive: false}, function (err, q) {

                    ch.bindQueue(q.queue, exchangeName, '');
                    messageUtil.info("Initalize Queue " + exchangeName + " for user: " + owner);
                });

                ch.assertQueue(participant + '-' + owner, {exclusive: false}, function (err, q) {

                    ch.bindQueue(q.queue, exchangeName, '');
                    messageUtil.info("Initalize Queue " + exchangeName + " for user: " + participant);
                });

            });
        });

    },
    initQueue: function (queuename, username) {


        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {


                ch.assertExchange(queuename, 'fanout', {durable: true});

                ch.assertQueue(username, {exclusive: false}, function (err, q) {

                    ch.bindQueue(q.queue, queuename, username);
                    messageUtil.info("Initalize Queue " + queuename + " for user: " + username);
                });
            });
        });
    },
    initPrivateQueue: function (owner, participant) {
        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {

                const exchange = "Private";
                const queuename = owner + "-" + participant;

                ch.assertExchange(exchange, 'fanout', {durable: true});

                ch.assertQueue(queuename, {exclusive: false}, function (err, q) {

                    ch.bindQueue(q.queue, exchange, queuename);
                    messageUtil.info("Initalize Private Queue " + queuename);
                });
            });
        });
    },
    receiveMessage: function (channelname, owner, participant, socket, callbackFunc) {


        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {

                // If user closes page or chat...
                /*
                 socket.on('disconnect', function () {
                     console.log("Anhalten...");
                     ch.close();
                 });
 */
                ch.assertExchange(channelname, 'fanout', {durable: true});

                ch.assertQueue(owner + '-' + participant, {exclusive: false}, function (err, q) {
                    ch.bindQueue(q.queue, channelname, '');


                    socket.on('disconnect', function () {
                        console.log("Anhalten...");
                        try {
                            conn.close();
                            callbackFunc();
                        } catch (ex) {
                            console.log(ex);
                        }

                    });

                    ch.consume(q.queue, function (msg) {

                        console.log("SocketID: ", socket.id);

                        messageUtil.info(owner + " received a message  '" + channelname + "': " + msg.content.toString());


//                        console.log(msg.content.toString());

                        var msgData = JSON.parse(msg.content.toString());
                        // If a new message is available, send it to the user/client


                        console.log("Emit message");
                        socket.emit("new-message", {
                            data: msgData
                        });

                        var collection = owner + '-' + participant;

                        history.save(collection, msgData);
                        ch.ack(msg); // Set message as already read


                    }, {noAck: false});

                });
            });
        });
    }
};