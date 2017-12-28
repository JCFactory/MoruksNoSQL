var express = require('express');
var router = express.Router();

var history = require('../components/history');



router.get('/', function(req, res, next) {
    res.json({});
});



router.get('/:owner/:channelname', function (req, res, next) {

    var channelname = req.params.channelname;
    var owner = req.params.owner;

    var collection = owner + '-' + channelname;

    history.get(collection, function (data) {
       res.json(data);
    });
});

module.exports = router;
