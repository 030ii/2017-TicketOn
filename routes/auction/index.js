var express = require('express');
var router = express.Router();

router.use('/post', require('./post'));
router.use('/put', require('./put'));
router.use('/list', require('./list'));
router.use('/detail', require('./detail'));
router.use('/pay', require('./pay'));

module.exports = router;
