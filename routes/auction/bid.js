var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');

router.post('/', function(req, res, next) {
    var body = req.body;
    pool.getConnection(function(err, connection) {
        async.waterfall([
            function(callback) {
                queryStr = "SELECT b_price FROM bid WHERE aid=? ORDER BY b_price DESC limit 1";
                connection.query(queryStr, body.aid, function(err, rows) {
                    if(err) callback(err);
                    callback(null, (rows[0]) ? rows[0].b_price : 0);
                });
            },
            function(price, callback) {
                if(price < body.price) {  // 입찰가가 현재 입찰가보다 높은경우
                    // 입찰 정보 삽입
                    queryStr = "INSERT INTO bid(aid, uid, b_price) VALUES(?,?,?)";
                    connection.query(queryStr, [body.aid, req.session.uid, body.price], function(err, rows) {
                          if(err) callback(err);
                          callback(null, true);
                    });
                } else {  // 입찰가가 현재 입찰가보다 낮은경우
                    callback(null, false);
                }
            }
        ], function(err, result) {
            if(err) console.log(err);
            res.send(result);
            connection.release();
        });
    });
});

module.exports = router;
