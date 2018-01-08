var express = require('express');
var router = express.Router();

var util = require('../components/rabbitmq');
var chat = require('../components/chat');
var mongo = require('../components/mongodb');


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

    if (owner === undefined || participant === undefined) {
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


module.exports = router;