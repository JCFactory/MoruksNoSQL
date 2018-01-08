var express = require('express');
var router = express.Router();
var SHA256 = require("crypto-js/sha256");

var userComponent = require('../components/user');


/**
 * GET - Get all users (only the usernames)
 */
router.get('/', function (req, res, next) {

    userComponent.getAllUsernames(function (data) {
        res.json(data);
    });

});


/**
 * POST - Add a new user
 */
router.post('/', function (req, res, next) {

    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;

    if (firstname == null || lastname == null || username == null || password == null) {
        res.json({
            status: false,
            message: "Missing parameter"
        });
    } else {

        var hashedPassword = SHA256(password);

        var userData = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: hashedPassword
        };

        userComponent.add(userData, function (result) {
            res.json(result);
        });
    }
});


/**
 * GET - Get user information by id
 */
router.get('/:username', function (req, res, next) {

    var username = req.params.username;

    userComponent.getByUserName(username, function (result) {
        res.json(result);
    });
});


/**
 * Login user
 */
router.post('/login', function (req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    if (username == null || password == null) {
        res.json({
            status: false,
            message: "Missing parameter"
        });
    } else {
        userComponent.checkCrediental(username, password, function (result) {
            res.json(result);
        });
    }
});


module.exports = router;