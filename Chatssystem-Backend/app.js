var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



// Import files for routing
var index = require('./routes/index');
var users = require('./routes/users');
var channels = require('./routes/channels');

var util = require('./components/rabbitmq');
var mongo = require('./components/mongodb');

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


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Routing
 */
app.use('/', index);
app.use('/users', users);
app.use('/channels', channels);


// Catch 404 and forward to error handler
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


mongo.connect(); // Connect with mongodb

util.receiveMessagesFromChannel("ch_1");
util.receiveMessagesFromChannel("General");
util.receiveMessagesFromChannel("Default");



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

