var amqp = require('amqplib/callback_api');
var mongodb = require('./mongodb');
var messageUtil = require('./message');
var myModule = require('../components/connectionHandler');

const SERVERIP = "amqp://localhost";
const EXCHANGE = "NoSQL-Chat";

module.exports = {

    /**
     * Send message to a channel
     * @param channel
     * @param message
     */
    sendMessageToChannel: function (channel, message, user) {

        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {

                ch.assertExchange(EXCHANGE, 'fanout', {durable: false});
                ch.publish(EXCHANGE, channel, new Buffer(message));
                messageUtil.info("Sent:" + channel + " " + message);
            });

            setTimeout(function () {
                conn.close();
            }, 500);
        });

        mongodb.storeMessage(message, channel, user);
    },
    /**
     * Receive a message and store this in mongodb
     */
    receiveMessagesFromChannel: function (channelName, username) {


        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {


                ch.assertExchange(EXCHANGE, 'fanout', {durable: true});

                ch.assertQueue(channelName, {exclusive: false}, function (err, q) {
                    messageUtil.info("Waiting for messages. To exit press CTRL+C");
                    ch.bindQueue(q.queue, EXCHANGE, channelName);


                    myModule.connections = conn;

                    ch.consume(q.queue, function (msg) {

                        // mongodb.storeMessage(msg.content.toString(), channelName);
                        messageUtil.info(username + " received a message  '" + channelName + "': " + msg.content.toString());
                    }, {consumerTag: username, noAck: false});

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
    receiveMessage: function (channelname, username, socket) {
        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {


                ch.assertExchange(channelname, 'fanout', {durable: true});

                ch.assertQueue(username, {exclusive: false}, function (err, q) {
                    messageUtil.info("Waiting for messages. To exit press CTRL+C");
                    ch.bindQueue(q.queue, channelname, username);

                    ch.consume(q.queue, function (msg) {

                        // mongodb.storeMessage(msg.content.toString(), channelName);
                        messageUtil.info(username + " received a message  '" + channelname + "': " + msg.content.toString());

                        // If a new message is available, send it to the user/client
                        socket.emit("newmessage", {
                            message: msg.content.toString()
                        });
                        ch.ack(msg); // Set message as already read

                        // If user closes page or chat...
                        socket.on('disconnect', function () {
                            console.log("Websocket wurde beendet");
                            ch.close();
                        });

                    }, {noAck: false});

                });
            });
        });
    }
};