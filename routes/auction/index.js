var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var moment = require('moment');
var async = require('async');

router.get('/', function(req, res) {
    pool.getConnection(function(err, connection) {
        async.series([
            function(callback) {
                // 모든 경매 정보 조회
                queryStr = 'SELECT * FROM auction ORDER BY a_deadline ASC';
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
            res.render('auction/products', {
                session: req.session,
                auction: results[0],  // 경매 정보
                bid: results[1] // 입찰 정보
            });
        });
    });
});

router.get('/time', function(req, res) {
    pool.getConnection(function(err, connection) {
        // 모든 경매의 마감시간 조회
        queryStr = 'SELECT a_deadline FROM auction ORDER BY a_deadline ASC';
        connection.query(queryStr, function(err, deadline) {
            if(err) console.log(err);
            var times = [];
            deadline.forEach(function(element, index) {
                times[index] = getTime(element.a_deadline);
            });
            res.send(times);
            connection.release();
        });
    });
});
router.use('/post', require('./post'));
router.use('/put', require('./put'));
router.use('/detail', require('./detail'));
router.use('/pay', require('./pay'));

var getTime = function(deadline) {
    var time = Date.now(deadline) - Date.now(); // 마감시간에서 현재시간을 뺀다
    console.log('time: ', time);
    console.log('deadline: ', new Date(deadline));
    console.log('now: ', Date.now());
    return moment(time).format('hh:mm:ss'); // 시:분:초 형식을 반환한다
}

module.exports = router;
