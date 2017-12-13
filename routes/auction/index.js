var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');

router.get('/', function(req, res) {
    pool.getConnection(function(err, connection) {
        async.series([
            function(callback) {
                // 마감시간 순으로 모든 경매 정보 조회
                queryStr = "SELECT * FROM auction WHERE a_status='0' ORDER BY a_deadline ASC";
                connection.query(queryStr, function(err, auctions) {
                    if(err) callback(err);
                    callback(null, auctions);
                });
            },
            function(callback) {
                // 모든 입찰 정보 조회
                queryStr = 'SELECT * FROM bid ORDER BY b_time DESC';
                connection.query(queryStr, function(err, bids) {
                    if(err) callback(err);
                    callback(null, bids);
                });
            }
        ], function(err, results) {
            connection.release();
            if(err) console.log(err);
            var times = [];
            results[0].forEach(function(element, index) {
                times[index] = getTime(element.a_deadline);
            });
            // 경매 목록 페이지 랜더링
            res.render('auction/products', {
                session: req.session,
                auction: results[0],  // 경매 정보
                time: times,  // 남은 시간
                bid: results[1] // 입찰 정보
            });
        });
    });
});
// 새로고침, ajax로 호출
router.get('/refresh', function(req, res) {
    pool.getConnection(function(err, connection) {
        async.series([
            function(callback) {
                // 마감시간 순으로 모든 경매 정보 조회
                queryStr = 'SELECT * auction ORDER BY a_deadline ASC';
                connection.query(queryStr, function(err, rows) {
                    if(err) callback(err);
                    callback(null, rows);
                });
            },
            function(callback) {
                // 입찰시간 순으로 경매번호 및 입찰가 조회
                queryStr = 'SELECT * FROM bid ORDER BY b_time DESC';
                connection.query(queryStr, function(err, rows) {
                    if(err) callback(err);
                    callback(null, rows);
                });
            }
        ], function(err, results) {
            if(err) console.log(err);
            var times = [];
            results[0].forEach(function(element, index) {
                times[index] = getTime(element.a_deadline);
            });
            res.send({
                auction: results[0],  // 경매 정보
                time: times,  // 남은 시간
                bid: results[1] // 입찰 정보
            });
            connection.release();
        });
    });
});

router.use('/post', require('./post'));
router.use('/put', require('./put'));
router.use('/detail', require('./detail'));
router.use('/pay', require('./pay'));
router.use('/bid', require('./bid'));

var getTime = function(deadline) {
    var time = deadline.getTime() - Date.now(); // 마감시간에서 현재시간을 뺀다
    return (time > 0) ? time : 0; // 시:분:초 형식을 반환한다
}

module.exports = router;
