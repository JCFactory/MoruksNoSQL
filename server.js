var express = require('express');
// var path = require('path');
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');
var mongo = require('mongodb').MongoClient;
var amqp = require('amqplib/callback_api');

var app = express();
var mongoUrl = 'mongodb://localhost:27017/rabbitDB';
var db;
var collections = {
    ch_1: {},
    ch_2: {}
};


//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

connectMongo();
connectRabbitMQ();

function connectMongo() {
    mongo.connect(mongoUrl, function (err, _db) {
        console.log("Weeeh, I connected mongo database successfully");
        db = _db;

        // create collection with same name like message queue
        db.createCollection("ch_1", function(err, res) {
            if (err) throw err;
            console.log("Collection ch_1 created!");
        });

        collections.ch_1 = db.collection('ch_1');
    });
}

function connectRabbitMQ() {
    amqp.connect('amqp://localhost', function (err, conn) {

        conn.createChannel(function (err, ch) {
            if (err) throw err;
            var q = 'ch_1';

            ch.assertQueue(q, {durable: true});
            // ch.prefetch(1);
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
            ch.consume(q, function (msg) {
                var message = msg.content.toString();
                storeMessage(message, q);
                console.log(" [x] Received %s", message);
                // ch.ack(msg);
            }, {noAck: true} );
        });
    });
}


function storeMessage(message, channel) {
    collections[channel].insert({name: 'Thaer', lname: 'Aldefai', message: message})
}

app.get('/', function (req, res) {
    res.send('<h1>Test Server for rabbitMQ...</h1>');
});


app.get('/channel/:id', function (req, res) {
    var id = req.params.id;
    var col = collections['ch_' + id];
    console.log('Collection: ', col);
    col.find().toArray(function (err, channel) {
        res.send(channel);
    });
});

app.get('/channel/:name/:message', function (req, res) {
    var msg = {
        name: req.params.name,
        message: req.params.message
    };
    // store name and message in MongoDB
    // ch_1_collection.insert(msg);
    res.send(msg);
});


app.listen(3000, function () {
    console.log('Server started on port 3000');
});