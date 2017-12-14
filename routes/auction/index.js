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
                    auctions.forEach(function(element, index) {
                        // 마감시간이 지나면
                        if(element.a_deadline.getTime() < Date.now())
                            changeStatus(element.aid);  // 경매 상태 변경
                    });
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
                times[index] = getTime(element.a_deadline); // 남은 시간들을 구한다
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
router.use('/post', require('./post'));
router.use('/put', require('./put'));
router.use('/pay', require('./pay'));
router.use('/bid', require('./bid'));
router.use('/', require('./detail'));

// 마감까지 남은 시간을 구함
var getTime = function(deadline) {
    var time = deadline.getTime() - Date.now(); // 마감시간에서 현재시간을 뺀다
    return (time > 0) ? time : 0; // 시:분:초 형식을 반환한다
}

// 마감시간이 지난 경매의 상태를 변경
var changeStatus = function(aid) {
    pool.getConnection(function(err, connection) {
        // 경매 상태를 마감으로 바꾼다
        query = "UPDATE auction SET a_status='1' WHERE aid=?";
        connection.query(query, aid, function(err, rows) {
            if(err) console.log(err);
            connection.release();
        });
    });
}
module.exports = router;
