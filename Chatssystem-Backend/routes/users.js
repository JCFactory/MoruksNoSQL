var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/**
 * Get user information by id
 */
router.get('/:id', function (req, res, next) {

});


/**
 * Login user
 */
router.post('/login', function (req, res, next) {

});

module.exports = router;
