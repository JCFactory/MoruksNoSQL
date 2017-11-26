var amqp = require('amqplib/callback_api');
var mongodb = require('./mongodb');
var messageUtil = require('./message');

const SERVERIP = "amqp://localhost";

module.exports = {

    /**
     * Send message to a channel
     * @param channel
     * @param message
     */
    sendMessageToChannel: function (channel, message, user) {

        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {

                ch.assertExchange(channel, 'fanout', {durable: false});
                ch.publish(channel, '', new Buffer(message));
                messageUtil.info("Sent: " + message);
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
    receiveMessagesFromChannel: function(channelName){

        amqp.connect(SERVERIP, function(err, conn) {
            conn.createChannel(function(err, ch) {

                ch.assertExchange(channelName, 'fanout', {durable: false});

                ch.assertQueue('', {exclusive: true}, function(err, q) {
                    messageUtil.info("Waiting for messages. To exit press CTRL+C");
                    ch.bindQueue(q.queue, channelName, '');

                    ch.consume(q.queue, function(msg) {
                        // mongodb.storeMessage(msg.content.toString(), channelName);
                        messageUtil.info("Message received in channel '" + channelName +"': " + msg.content.toString());
                    }, {noAck: true});
                });
            });
        });
    }

};