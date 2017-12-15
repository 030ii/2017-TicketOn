var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');

router.get('/', function(req, res, next) {
    if(!req.session.admin) {  // 관리자가 아니면
        res.redirect('/');
        return;
    }
    pool.getConnection(function(err, connection) {
        async.series([
            function(callback) {
                // 경매 정보 및 판매자 조회
                query = "SELECT A.aid, A.a_category, A.a_title, A.a_img, A.a_status, A.a_deadline, A.a_min_price, U.u_name "
                        + "FROM auction AS A JOIN user AS U WHERE A.uid = U.uid;";
                connection.query(query, function(err, rows) {
                    if(err) callback(err);
                    callback(null, rows);
                });
            },
            function(callback) {
                // 최종 입찰자 정보 조회
                query = "SELECT A.aid, B.b_price, U.u_name FROM auction AS A JOIN bid AS B JOIN user AS U "
                        + "WHERE B.b_price IN (SELECT MAX(b_price) FROM bid GROUP BY aid) AND B.aid = A.aid AND B.uid = U.uid"
                connection.query(query, function(err, rows) {
                    if(err) callback(err);
                    callback(null, rows);
                });
            },
            function(callback) {
                // 상태별 경매 수 정보 조회
                query = "SELECT a_status, count(*) AS cnt FROM auction GROUP BY a_status";
                connection.query(query, function(err, rows) {
                    if(err) callback(err);
                    var status = [0,0,0,0];
                    rows.forEach(function(element, index) {
                        status[Number(element.a_status)] = element.cnt;
                    });
                    status[3] = status[0] + status[1] + status[2];
                    callback(null, status);
                });
            },
            function(callback) {
                // 입찰 횟수 조회
                query = "SELECT aid, count(*) AS cnt FROM bid GROUP BY aid";
                connection.query(query, function(err, rows) {
                    if(err) callback(err);
                    callback(null, rows);
                });
            }
        ], function(err, results) {
            if(err) console.log(err);
            res.render('admin/auctions', {
                auction: results[0],  // 경매 정보 및 판매자 정보
                bid: results[1],  // 입찰 정보 및 입찰자 정보
                aCount: results[2],  // 상태별 경매 수
                bCount: results[3], // 경매 별 입찰 수
                session: req.session
            });
        });
    })
});

module.exports = router;
