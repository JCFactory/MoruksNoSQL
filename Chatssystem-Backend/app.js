var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var chatComponent = require('./components/chat');

// Import files for routing
var index = require('./routes/index');
var users = require('./routes/users');
var chats = require('./routes/chats');
var chatmessage = require('./routes/chatmessage');
var history = require('./routes/history');


var util = require('./components/rabbitmq');
var mongo = require('./components/mongodb');


connections = [];

io.on('connect', function (socket) {
    connections.push(socket);
    console.log("Websocket connection opened: " + connections.length);

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
app.use('/chats', chats);
app.use('/chatmessage', chatmessage);
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

mongo.connect(); // Connect with mongodb


var privatechat = io.of('/chatmessage');
privatechat.on('connection', function (socket) {


    socket.on('disconnect', function (data) {
        console.log('Disconnect...');
        socket.removeAllListeners('new-message');
    });


    // Connect user...
    socket.on('connect-chat', function (data) {

        var owner = data.owner;
        var participant = data.participant;
        var exchange = participant;

        console.log("Login: " + owner + " in: " + owner + '-' + participant);

        if (participant === "Default" || participant === "General") {
            console.log("Group Chat");
            socket.on('new-message', function (datax) {
                console.log(data);

                util.sendMessageToChannel(data.participant, datax.message, data.owner, function () {
                    console.log("Message sent");
                });
            });

            util.receiveMessage(exchange, owner, participant, socket, function () {
                console.log("Stopped");
            });


        } else {
            chatComponent.getExchangeName(owner, participant, function (datax) {
                if (datax !== null) {
                    console.log(datax);
                    var exchange = datax;
                    console.log("Privat Chat");

                    socket.on('new-message', function (data) {
                        console.log("Neue Nachricht: " + exchange + " " + data.message + " " + owner);
                        util.sendMessageToChannel(exchange, data.message, owner,function () {
                            console.log("Message sent");
                        });
                    });

                    util.receiveMessage(exchange, owner, participant, socket, function () {
                        console.log("Stopped Privat Chat");
                    });

                } else {
                    console.log("No Exchange found. Closing Socket");
                    //socket.close();
                }

            });

        }

    });

});


/*
var privatechat = io.of('/chatmessage');
privatechat.on('connection', function (socket) {

    // Connect user...
    socket.on('connect-chat', function (data) {

        var owner = data.owner;
        var participant = data.participant;
        //var exchange = null;

        console.log("Login: " + data.owner + " in: " + data.owner + '-' + data.participant);
        if (participant == "Default" || participant == "General") {
            var exchange = participant;

            console.log("Gruppen Chat");

            socket.emit('status', "erfolgreich");

            socket.on('new-message', function (data) {
                console.log("Neue Nachricht: " + exchange + " " + data.message + " " + owner);
                util.sendMessageToChannel(exchange, data.message, owner);
            });





            util.receiveMessage(exchange, owner, participant, socket);

        } else {
            chatComponent.getExchangeName(owner, participant, function (datax) {
                if (datax !== null) {
                    console.log(datax);
                    var exchange = datax;
                    console.log("Privat Chat");

                    socket.emit('status', "erfolgreich");

                    socket.on('new-message', function (data) {
                        console.log("Neue Nachricht: " + exchange + " " + data.message + " " + owner);
                        util.sendMessageToChannel(exchange, data.message, owner);
                    });

                    util.receiveMessage(exchange, owner, participant, socket);

                } else {
                    console.log("No Exchange found. Closing Socket");
                    //socket.close();
                }

            });

        }


    });

});
*/

// Init Queue

const GENERAL = "General";
const DEFAULT = "Default";
var userList = ["inanbayram", "steffen", "jacky"];

// function createGroupChats(userList) {
//
//     console.log(userList);
//
//     userList.forEach(function (username) {
//         chatComponent.createGroupChat(username, GENERAL);
//         //util.initQueue(GENERAL, username);
//     });
//
//     userList.forEach(function (username) {
//         chatComponent.createGroupChat(username, DEFAULT);
//         //util.initQueue(DEFAULT, username);
//     });
// }


// initUserList(createGroupChats);


setTimeout(function () {
    userList.forEach(function (username) {
        chatComponent.createGroupChat(username, GENERAL);
        //util.initQueue(GENERAL, username);
    });

    userList.forEach(function (username) {
        chatComponent.createGroupChat(username, DEFAULT);
        //util.initQueue(DEFAULT, username);
    });
}, 1000);
