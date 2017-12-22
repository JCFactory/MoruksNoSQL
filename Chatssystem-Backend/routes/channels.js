var express = require('express');
var app = require('../app');
var appio = require('../app').server;
var router = express.Router();

var util = require('../components/rabbitmq');
var mongo = require('../components/mongodb');
const SERVERIP = "amqp://localhost";
const EXCHANGE = "NoSQL-Chat";
var amqp = require('amqplib/callback_api');

/**
 * Get channel information by id
 */
router.get('/:id', function (req, res, next) {

    var channelID = req.params.id;

    mongo.getData(channelID, function (data) {
        res.json(data);
    });


});

const io = require('socket.io')(appio);



//console.log(appio);

var iosa = io.of('/channels');
iosa.on('connection', function (socket) {
   socket.emit("news", "asdsad");
});


/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("loo");
    var iosa = res.io.of('/channels/General/inan');
    iosa.emit("news", "channels");


    iosa.on('data', function (data) {
        console.log(data);
    });
});


router.get('/:channelname/:username', function (req, res, next) {

    console.log("yoo bin drin");


        res.io.emit("socketToMe", "users");
        res.send('respond with a resource.');


    /*
    var iosa = res.io.of('/channels/General/inan');

    iosa.on('connection', function (socket) {

        console.log("websocket");
        socket.emit("news", {data: '21'});


    });

    iosa.emit("new", {data: '2121'});
    */

/*
    var channelname = req.params.channelname;
    var username = req.params.username;

    const SERVERIP = "amqp://localhost";
    const EXCHANGE = "NoSQL-Chat";

    amqp.connect(SERVERIP, function (err, conn) {
        conn.createChannel(function (err, ch) {


            ch.assertExchange(channelname, 'fanout', {durable: true});

            ch.assertQueue(username, {exclusive: false}, function (err, q) {
                //messageUtil.info("Waiting for messages. To exit press CTRL+C");
                ch.bindQueue(q.queue, channelname, username);


                return ch.consume(q.queue, function (msg) {

                    console.log("Nachricht ist da");
                    // mongodb.storeMessage(msg.content.toString(), channelName);
                    //messageUtil.info(username + " received a message  '" + channelName + "': " + msg.content.toString());
                    ch.ack(msg);
                    //return res.json(msg.content.toString());

                }, {noAck: false});

            });
        });
    });
    */

});


/**
 *  POST reuqest => Send message
 *  Parameters in body:     channel => ChannelID
 *                          message => Message
 */
router.post('/message', function (req, res, next) {

    var channel = req.body.channel;
    var message = req.body.message;
    var user = req.body.user;

    if (channel == null || message == null) {
        res.json({
            status: false,
            message: "Missing parameter"
        });
    } else {
        util.sendMessageToChannel(channel, message, user);

        res.json({
            status: true
        });
    }

});


module.exports = router;