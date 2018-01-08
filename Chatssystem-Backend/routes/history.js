var express = require('express');
var router = express.Router();

var history = require('../components/history');


/**
 * GET - Index
 */
router.get('/', function(req, res, next) {
    res.json({});
});


/**
 * GET - Get history of a chat
 */
router.get('/:owner/:chat', function (req, res, next) {

    var chatName = req.params.chat;
    var owner = req.params.owner;

    var collection = owner + '-' + chatName;

    history.get(collection, function (data) {
       res.json(data);
    });
});


module.exports = router;