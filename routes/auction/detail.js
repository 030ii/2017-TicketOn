var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');
var moment = require('moment');

router.get('/:aid', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        async.series([
            function(callback) {
                // 해당 경매 정보와 판매자 정보 조회
                queryStr = 'SELECT * FROM auction AS A JOIN user AS U WHERE U.uid=(' +
                          'SELECT uid FROM auction WHERE aid=?) AND A.aid=?';
                connection.query(queryStr, [req.params.aid, req.params.aid], function(err, rows) {
                    if(err) callback(err);
                    callback(null, rows[0]);
                });
            },
            function(callback) {
                // 해당 경매에 대한 입찰정보를 내림차순으로 조회
                queryStr = 'SELECT * FROM bid AS B JOIN user AS U WHERE U.uid=(' +
                          'SELECT uid FROM bid WHERE aid=?) AND B.aid=? ORDER BY bid DESC';
                connection.query(queryStr, [req.params.aid, req.params.aid], function(err, rows) {
                    if(err) callback(err);
                    callback(null, rows);
                });
            }
        ], function(err, results) {
            if(err) console.log(err);
            var time = getTime(results[0].a_deadline);
            // 경매 상세정보 페이지 렌더링
            res.render('auction/detail', {
                auction: results[0],  // 경매 정보
                time: time, // 남은 시간
                bid: results[1],  // 입찰 정보
                session: req.session
            });
            connection.release();
        });
    });
});

var getTime = function(deadline) {
    var time = deadline.getTime() - Date.now(); // 마감시간에서 현재시간을 뺀다
    return (time > 0) ? time : 0; // 시:분:초 형식을 반환한다
}

module.exports = router;
