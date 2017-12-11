var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;

router.get('/', function(req, res, next){
    res.render('auction/product', {
        session: req.session
    });
});

module.exports = router;
