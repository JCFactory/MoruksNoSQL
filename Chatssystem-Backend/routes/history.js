var express = require('express');
var router = express.Router();

var history = require('../components/history');



router.get('/', function(req, res, next) {
    res.json({});
});



router.get('/:channelname', function (req, res, next) {

    var channelname = req.params.channelname;

    history.get(channelname, function (data) {
       res.json(data);
    });
});

module.exports = router;
