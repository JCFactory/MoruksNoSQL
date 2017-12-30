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
    sendMessageToChannel: function (channel, message, user) {

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
            });

            /*
            setTimeout(function () {
                conn.close();
            }, 500);
            */
        });

        //mongodb.storeMessage(message, channel, user);
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


                    ch.consume(q.queue, function (msg) {

                        // mongodb.storeMessage(msg.content.toString(), channelName);
                        messageUtil.info(username + " received a message  '" + channelName + "': " + msg.content.toString());
                    }, {consumerTag: username, noAck: false});

                });
            });
        });
    },
    initGroupChat: function (owner, groupname) {

        const exchangeName = groupname;

        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {


                ch.assertExchange(exchangeName, 'fanout', {durable: true});

                ch.assertQueue(owner, {exclusive: false}, function (err, q) {

                    ch.bindQueue(q.queue, exchangeName, owner);
                    messageUtil.info("Initalize Queue " + exchangeName + " for user: " + owner);
                });


            });
        });

    },
    initChat: function (owner, participant) {

        const exchangeName = owner + '-' + participant;

        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {


                ch.assertExchange(exchangeName, 'fanout', {durable: true});

                ch.assertQueue(owner, {exclusive: false}, function (err, q) {

                    ch.bindQueue(q.queue, exchangeName, owner);
                    messageUtil.info("Initalize Queue " + exchangeName + " for user: " + owner);
                });

                ch.assertQueue(participant, {exclusive: false}, function (err, q) {

                    ch.bindQueue(q.queue, exchangeName, participant);
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
    receiveMessage: function (channelname, owner, participant, socket) {
        amqp.connect(SERVERIP, function (err, conn) {
            conn.createChannel(function (err, ch) {


                ch.assertExchange(channelname, 'fanout', {durable: true});

                ch.assertQueue(owner, {exclusive: false}, function (err, q) {
                    ch.bindQueue(q.queue, channelname, owner);

                    /*
                    setInterval(function(){
                        console.log("send");
                        socket.emit('new-message', "def");
                    }, 5000);
                    */

                    ch.consume(q.queue, function (msg) {


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


                        // If user closes page or chat...
                        socket.on('disconnect', function () {
                            console.log("Websocket wurde beendet");
                            socket.disconnect();
                            //ch.close();
                        });

                    }, {noAck: false});

                });
            });
        });
    }
};