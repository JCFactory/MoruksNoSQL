var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var amqp = require('amqplib/callback_api');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


var db;
var collections = {
    ch_1: {},
    ch_2: {}
};


connectMongo();
connectRabbitMQ();

function connectMongo() {
    mongo.connect('mongodb://localhost:27017/rabbitDB', function (err, _db) {
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

// todo move to route: channel
// app.get('/channel/:id', function (req, res) {
//     var id = req.params.id;
//     var col = collections['ch_' + id];
//     console.log('Collection: ', col);
//     col.find().toArray(function (err, channel) {
//         res.send(channel);
//     });
// });

// todo move to route: channel
// app.get('/channel/:name/:message', function (req, res) {
//     var msg = {
//         name: req.params.name,
//         message: req.params.message
//     };
//     // store name and message in MongoDB
//     // ch_1_collection.insert(msg);
//     res.send(msg);
// });

