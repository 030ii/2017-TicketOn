var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;

router.use('/', require('./auctions'));
router.use('/users', require('./users'));

module.exports = router;
