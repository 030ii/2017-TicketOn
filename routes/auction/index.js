var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');

router.get('/', function(req, res) {
    if(req.session.admin) {  // 관리자이면
        res.redirect('/admin');
        return;
    }
    pool.getConnection(function(err, connection) {
        async.series([
            function(callback) {
                // 마감시간 순으로 모든 경매 정보 조회
                query = "SELECT * FROM auction WHERE a_status='0' ORDER BY a_deadline ASC";
                connection.query(query, function(err, auctions) {
                    if(err) callback(err);
                    callback(null, auctions);
                });
            },
            function(callback) {
                // 모든 입찰 정보 조회
                query = 'SELECT * FROM bid ORDER BY b_time DESC';
                connection.query(query, function(err, bids) {
                    if(err) callback(err);
                    callback(null, bids);
                });
            },
            function(callback) {
                // 분류별 경매 수 조회
                query = 'SELECT a_category, count(*) cnt FROM auction WHERE a_status="0" GROUP BY a_category';
                connection.query(query, function(err, category) {
                    if(err) callback(err);
                    var list = ['뮤지컬/연극', '영화', '전시/체험', '콘서트/마술', '외식/편의점', '놀이동산/컨텐츠', '뷰티/생활'];
                    var count = [0,0,0,0,0,0,0,0];
                    category.forEach(function(element, index) {
                        count[list.indexOf(element.a_category)] = Number(element.cnt);
                    });
                    for(var i = 0; i < count.length - 1; i++) {
                        count[7] += count[i];  // 전체 갯수를 구한다
                    }
                    callback(null, count);
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
                bid: results[1], // 입찰 정보
                count: results[2] // 분류별 경매 수
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
module.exports = router;
