var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');

router.get('/', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        query = "SELECT A.a_title, B.b_price, P.p_time FROM pay AS P JOIN bid AS B JOIN auction AS A WHERE P.uid=? AND "
                + "B.b_price = (SELECT MAX(b_price) FROM bid WHERE aid=A.aid) AND P.aid=A.aid";
        connection.query(query, req.session.uid, function(err, rows) {
            if(err) console.log(err);
            res.render('mypage/pays', {
                pay: rows,
                session: req.session
            });
        });
    });
});

module.exports = router;
