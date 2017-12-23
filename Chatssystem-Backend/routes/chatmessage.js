var express = require('express');
var router = express.Router();
var appio = require('../app').server;
const io = require('socket.io')(appio);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
