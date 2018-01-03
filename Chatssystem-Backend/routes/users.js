var express = require('express');
var router = express.Router();
var SHA256 = require("crypto-js/sha256");
var chatComponent = require('../components/chat');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'nosql'
});
connection.connect();


/* GET users listing. */
router.get('/', function (req, res, next) {

    connection.query('SELECT username FROM user', function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            res.json(results);
        }
    });
});


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


        var query = connection.query('INSERT INTO user SET ?', userData, function (error, results, fields) {
            if (error) {
                throw error;
            }


            if (results.affectedRows > 0) {

                chatComponent.createGroupChat(username, "General");
                chatComponent.createGroupChat(username, "Default");

                res.json({
                    status: true
                });
            } else {
                res.json({
                    status: false,
                    message: "User not created"
                })
            }
        });
    }

});


/**
 * Get user information by id
 */
router.get('/:username', function (req, res, next) {


    var username = req.params.username;

    connection.query('SELECT id, firstname, lastname FROM user WHERE username = ?', username, function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            if (results.length > 0) {
                res.json({
                    status: true,
                    data: results
                })
            } else {
                res.json({
                    status: false,
                    message: "User not found"
                })

            }
        }
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

        connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (error) {
                throw error;
            } else {
                if (results.length > 0) {
                    res.json({
                        status: true,
                        message: "Login okay"
                    })

                } else {
                    res.json({
                        status: false,
                        message: "Login failed"
                    })

                }
            }
        });

    }

});

module.exports = router;
