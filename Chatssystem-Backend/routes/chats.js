var express = require('express');
var router = express.Router();

var util = require('../components/rabbitmq');
var chat = require('../components/chat');
var mongo = require('../components/mongodb');


/**
 * Get channel information by id
 */
/*
 router.get('/:id', function (req, res, next) {

 var channelID = req.params.id;

 mongo.getData(channelID, function (data) {
 res.json(data);
 });


 });
 */

/**
 * Index
 */
router.get('/', function (req, res, next) {

    res.json({});
});


/**
 * POST request => Create a new chat for a specific user
 */
router.post('/', function (req, res, next) {

    var owner = req.body.owner;
    var participant = req.body.participant;


    if (owner == undefined || participant == undefined) {
        res.json({
            status: false,
            message: "Missing parameter"
        });
    } else {

        chat.alreadyExist(owner, participant, function (status) {
            if (status) {
                res.json({
                    status: false,
                    message: "Chat already exists"
                });
            } else {
                // Insert data in collection and create queue
                chat.create(owner, participant, function (data) {
                    res.json({
                        status: true,
                        message: "Chat created"
                    });
                });
            }
        });
    }

});


router.get('/:username', function (req, res, next) {

    chat.getByUsername(req.params.username, function (data) {
        res.json(data);
    })

});


/**
 *  POST reuqest => Send message
 *  Parameters in body:     channel => ChannelID
 *                          message => Message
 */
/*
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
 */

module.exports = router;