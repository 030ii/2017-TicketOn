var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;

router.get('/', function(req, res, next) {
    req.session.uid = 1;
    res.render('auction/post.ejs');
});

router.post('/', function(req, res, next) {
    var body = req.body;
    
    var queryStr = 'INSERT INTO auction(uid, a_title, a_content, a_img, a_start, a_min_price, a_deadline)'
                  + ' VALUES(?,?,?,?,?,?,?)';
    var inputs = [req.session.uid, body.title, body.content, body.img, Date.now(),
                    body.minPrice, Date.now() + Number(body.deadline)];
    console.log('input: ', inputs);
    pool.getConnection(function(err, connection) {
        connection.query(queryStr, inputs, function(err, rows) {
            if(err) console.log("err: ", err);
            res.redirect('/auctionList');
            connection.release();
        });
    });
});

module.exports = router;
