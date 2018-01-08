var mysql = require('mysql');
var chatComponent = require('../components/chat');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'nosql'
});

var user = function () {
};


/**
 * Get all users
 * @param callback
 */
user.getAll = function (callback) {

    connection.query('SELECT * FROM user', function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            callback(results);
        }
    });
};


/**
 * Get all usernames of the userlist (db)
 * @param callback
 */
user.getAllUsernames = function (callback) {

    connection.query('SELECT username FROM user', function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            callback(results);
        }
    });
};


/**
 * Add a new user and create the neccessary queues
 * @param userData
 * @param callback
 */
user.add = function (userData, callback) {

    connection.query('INSERT INTO user SET ?', userData, function (error, results, fields) {
        if (error) {
            throw error;
        }

        if (results.affectedRows > 0) {

            chatComponent.createGroupChat(username, "General");
            chatComponent.createGroupChat(username, "Default");


            callback({
                status: true,
                message: "User created"
            });
        } else {
            callback({
                status: false,
                message: "User not created"
            })
        }
    });
};


/**
 * Get user information by username
 * @param username
 * @param callback
 */
user.getByUserName = function (username, callback) {

    connection.query('SELECT id, firstname, lastname FROM user WHERE username = ?', username, function (error, results, fields) {
        if (error) {
            throw error;
        }

        if (results.length > 0) {
            callback({
                status: true,
                data: results
            });
        } else {
            callback({
                status: false,
                message: "User not found"
            });
        }

    });
};



user.checkCrediental = function (username, password, callback) {
    connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            if (results.length > 0) {
                callback({
                    status: true,
                    message: "Login okay"
                })

            } else {
                callback({
                    status: false,
                    message: "Login failed"
                })

            }
        }
    });
};


module.exports = user;