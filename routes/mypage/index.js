var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');

router.get('/', function(req, res, next) {
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
            },
            function(callback) {
                // 사용자의 결제 정보 조회
                query = "SELECT * FROM pay WHERE uid=?"
                connection.query(query, req.session.uid, function (err, rows) {
                    if(err) callback(err);
                    callback(null, rows);
                });
            },
            function(callback) {
                query = "SELECT * FROM auction AS A JOIN user AS U JOIN bid AS B WHERE A.uid=? "
                  + "AND U.uid=B.uid AND B.b_price=(SELECT MAX(b_price) FROM bid WHERE aid=A.aid) AND A.a_status<>'0'";
                connection.query(query, req.session.uid, function(err, rows) {
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
                pay: results[4],
                income: results[5],
                session: req.session
            });
            connection.release();
        });
    });
});

router.delete('/', function(req, res) {
    var body = req.body;
    pool.getConnection(function (err, connection) {
        // 사용자 정보 삭제
        query = "DELETE FROM user WHERE uid=?"
        connection.query(query, body.uid, function (err) {
            if(err) console.log(err);
            connection.release();
        });
    });
});

router.use('/changeInfo', require('./changeInfo'));
router.use('/changePwd', require('./changePwd'));
router.use('/changeDeposit', require('./changeDeposit'));
router.use('/pays', require('./pays'));
router.use('/incomes', require('./incomes'));
router.use('/sucbids', require('./sucbids'));
router.use('/auctions', require('./auctions'));

module.exports = router;
