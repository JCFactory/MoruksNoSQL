var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


// Import files for routing
var index = require('./routes/index');
var users = require('./routes/users');
var channels = require('./routes/channels');
var chatmessage = require('./routes/chatmessage');


var util = require('./components/rabbitmq');
var mongo = require('./components/mongodb');


connections = [];

io.on('connect', function (socket) {
    connections.push(socket);
    console.log("Websocket connection opened: " + connections.length)

    socket.on('disconnect', function (socket) {
        connections.splice(connections.indexOf(socket), 1);
        console.log("Websocket connection closed: " + connections.length);
    });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.io = io;

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function (req, res, next) {
    res.io = io;
    next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
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
app.use('/chatmessage', chatmessage);


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


//myModule.connections.push("Lets begin");

//module.exports = app; OLD
module.exports = {app: app, server: server, io: io};

mongo.connect(); // Connect with mongodb


/*
 Websockets
 */
var iosa = io.of('/chatmessage');
iosa.on('connection', function (socket) {

    var username = "unknown";
    var channelname = "General";

    socket.on('connect-chat', function (data) {

        username = data.username;
        console.log(data.username + " logged in");

        // User sends a new message
        socket.on('new-message', function (data) {
            console.log("Neue Nachricht: " + channelname + " " + data.message + " " + username);
            util.sendMessageToChannel(channelname, data.message, username);
        });

        util.receiveMessage(channelname, username, socket);
    });

});


// Init Queue

const GENERAL = "General";
const DEFAULT = "Default";
var userList = ["inan", "steffen", "jacky"];


userList.forEach(function (username) {
    util.initQueue(GENERAL, username);
});

userList.forEach(function (username) {
    util.initQueue(DEFAULT, username);
});