var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');

router.get('/', function(req, res, next){
    pool.getConnection(function (err, connection) {
        async.parallel([
            function(callback) {
                // 사용자의 정보 조회
                query = "SELECT * FROM user WHERE uid=?";
                connection.query(query, req.session.uid, function (err, rows) {
                    if(err) callback(err);
                    callback(null, rows[0]);
                });
            },
            function(callback) {
                // 사용자의 입찰 정보 조회
                query = "SELECT * FROM bid WHERE uid=?";
                connection.query(query, req.session.uid, function (err, rows) {
                    if(err) callback(err);
                    callback(null, rows);
                });
            },
            function(callback) {
                // 사용자의 경매 정보 조회
                query = "SELECT * FROM auction WHERE uid=?";
                connection.query(query, req.session.uid, function (err, rows) {
                    if(err) callback(err);
                    callback(null, rows);
                });
            },
            function(callback) {
                // 사용자의 낙찰 정보 조회
                query = "SELECT * FROM sucbid WHERE uid=?"
                connection.query(query, req.session.uid, function (err, rows) {
                    if(err) callback(err);
                    callback(null, rows);
                });
            }
        ], function(err, results) {
            if(err) console.log(err);
            res.render('mypage/index', {
                user: results[0],
                bid: results[1],
                auction: results[2],
                sucbid: results[3],
                session: req.session
            });
            connection.release();
        });
    });
});

router.use('/bids', require('./bids'));
router.use('/changeInfo', require('./changeInfo'));
router.use('/changePwd', require('./changePwd'));
router.use('/deposits', require('./deposits'));
router.use('/pays', require('./pays'));
router.use('/requests', require('./requests'));
router.use('/sucbids', require('./sucbids'));

module.exports = router;
