var amqp = require('amqplib/callback_api');
var mongodb = require('./mongodb');
var messageUtil = require('./message');

const SERVERIP = "amqp://localhost";
const EXCHANGE = "NoSQL-Chat";


var rabbbit = function () {
    console.log("Main");
};


rabbbit.connect = function (callback) {
    amqp.connect(SERVERIP, function (err, conns) {
        console.log("ok");
        if (err) {
            callback(true);
            throw err;
        } else {
            rabbbit.conn = conns;
            callback(false);
        }
    });
};

/**
 * Send message to a channel
 * @param channel
 * @param message
 */
rabbbit.sendMessageToChannel = function (channel, message, user) {

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
};

/**
 * Receive a message and store this in mongodb
 */
rabbbit.receiveMessagesFromChannel = function (channelName, username) {



    rabbbit.conn.createChannel(function (err, ch) {

        console.log(username);
        ch.assertExchange(EXCHANGE, 'fanout', {durable: false});

        ch.assertQueue(channelName, {exclusive: false}, function (err, q) {
            messageUtil.info("Waiting for messages. To exit press CTRL+C");
            ch.bindQueue(q.queue, EXCHANGE, channelName);


            ch.consume(q.queue, function (msg) {

                // mongodb.storeMessage(msg.content.toString(), channelName);
                messageUtil.info("Message received in channel inan '" + channelName + "': " + msg.content.toString());


                ch.ack(msg);
            }, {consumerTag: username, noAck: false});


            /*
             ch.consume(q.queue, function(msg) {

             // mongodb.storeMessage(msg.content.toString(), channelName);
             messageUtil.info("Message received in channel steffen '" + channelName +"': " + msg.content.toString());
             }, {consumerTag: "steffen", noAck: false});
             */
        });
    });
};

module.exports = rabbbit;