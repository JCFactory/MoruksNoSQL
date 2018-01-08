var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var chatComponent = require('./components/chat');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


// Import files for routing
var index = require('./routes/index');
var users = require('./routes/users');
var chats = require('./routes/chats');
var history = require('./routes/history');


var messageUtil = require('./components/message');
var util = require('./components/rabbitmq');
var mongo = require('./components/mongodb');
var userComponent = require('./components/user');


connections = [];

// Websocket
io.on('connect', function (socket) {
    connections.push(socket);
    messageUtil.info("Websocket connection opened. Currently connected: " + connections.length);

    socket.on('disconnect', function (socket) {
        connections.splice(connections.indexOf(socket), 1);
        messageUtil.info("Websocket connection closes. Currently connected: " + connections.length);
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
app.use('/chats', chats);
app.use('/history', history);


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


module.exports = {app: app, server: server, io: io};

/* Connect with mongodb */
mongo.connect();


// Websocket /chatmessage
var privatechat = io.of('/chatmessage');
privatechat.on('connection', function (socket) {


    socket.on('disconnect', function (data) {
        socket.removeAllListeners('new-message');
    });


    // Connect user...
    socket.on('connect-chat', function (data) {

        var owner = data.owner;
        var participant = data.participant;
        var exchange = participant;

        messageUtil.info(owner + "logged in "+ owner + '-' + participant)

        /* If Chat is public */
        if (participant === "Default" || participant === "General") {
            messageUtil.info("Join Group Chat");

            socket.on('ack', function (ackData) {

                if (ackData.ack === true) {
                    util.sendMessageToChannel(data.participant, ackData, data.owner, function () {

                    });
                }
            });

            socket.on('new-message', function (datax) {

                util.sendMessageToChannel(data.participant, datax.message, data.owner, function () {

                });
            });

            util.receiveMessage(exchange, owner, participant, socket, function () {
                messageUtil.info("Stop consuming messages");
            });


        } else {
            chatComponent.getExchangeName(owner, participant, function (datax) {
                if (datax !== null) {
                    messageUtil.info("Joing Private Chat");
                    var exchange = datax;

                    socket.on('ack', function (ackData) {

                        if (ackData.ack === true) {
                            util.sendMessageToChannel(exchange, ackData, owner, function () {

                            });
                        }

                    });

                    socket.on('new-message', function (data) {

                        util.sendMessageToChannel(exchange, data.message, owner, function () {

                        });
                    });

                    util.receiveMessage(exchange, owner, participant, socket, function () {
                        messageUtil.info("Stop consuming messages");
                    });

                } else {
                    messageUtil.warning("Exchange not found. Closing Web-Socket");
                }
            });
        }
    });
});


/* Initialize Users and their exchanges/queues*/
const GENERAL = "General";
const DEFAULT = "Default";

userComponent.getAll(function (userList) {

    userList.forEach(function (user) {
        chatComponent.createGroupChat(user.username, GENERAL);
    });

    userList.forEach(function (user) {
        chatComponent.createGroupChat(user.username, DEFAULT);
    });
});

