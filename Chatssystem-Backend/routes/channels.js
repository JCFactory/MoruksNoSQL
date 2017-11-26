var express = require('express');
var router = express.Router();
//var expressWs = require('express-ws')(router);

var util = require('../components/rabbitmq');
var mongo = require('../components/mongodb');

/**
 * Get all available channels
 */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


/**
 * Get channel information by id
 */
router.get('/:id', function (req, res, next) {


    var channelID = req.params.id;

    mongo.getData(channelID, function (data) {
        res.json(data);
    });


});

/*
router.ws('/ws', function (ws, req) {

    ws.send("hello");
    ws.on('message', function(msg) {
        ws.send(msg);
        console.log(msg);
        setTimeout(function timeout() {
            ws.send(Date.now());
        }, 500);
    });
});

*/



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
