var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var upload = require('../../config.js').upload;

router.get('/', function(req, res, next) {
    res.render('auction/post', {
        session: req.session
    });
});

router.post('/', upload.single('img'), function(req, res, next) {
    var body = req.body;
    var date = new Date();
    date.setTime(date.getTime() + (Number(body.deadline) * 1000 * 60 * 60));
    var queryStr = 'INSERT INTO auction(uid, a_title, a_content, a_img, a_min_price, a_deadline)'
                  + ' VALUES(?,?,?,?,?,?)';
    var inputs = [req.session.uid, body.title, body.content, req.file.filename,
                    body.minPrice, date];
    pool.getConnection(function(err, connection) {
        connection.query(queryStr, inputs, function(err, rows) {
            if(err) console.log("err: ", err);
            res.redirect('/auction');
            connection.release();
        });
    });
});

module.exports = router;
