var express = require('express');
var router = express.Router();

router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/register', require('./register'));
router.use('/findID', require('./findID'));
router.use('/findPwd', require('./findPwd'));

module.exports = router;
