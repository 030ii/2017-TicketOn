var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');

router.get('/', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        async.series([
            function(callback) {
                query = "SELECT A.a_img, A.a_title, A.a_deadline, A.a_status, U.uid, U.u_name, B.b_price FROM auction AS A JOIN"
                  + " user AS U JOIN bid AS B WHERE A.uid=? AND U.uid=B.uid AND B.b_price=(SELECT MAX(b_price) FROM bid WHERE "
                  + " aid=A.aid) AND A.a_status<>'0' AND A.aid=B.aid ORDER BY A.a_deadline DESC";
                connection.query(query, req.session.uid, function(err, rows) {
                    if(err) callback(err);
                    callback(null, rows);
                });
            },
            function(callback) {
                query = "SELECT A.a_title, A.a_status, B.b_price FROM auction AS A JOIN user AS U JOIN bid AS B WHERE A.uid=? "
                + "AND U.uid=B.uid AND B.b_price=(SELECT MAX(b_price) FROM bid WHERE aid=A.aid) AND A.a_status<>'0'";
                connection.query(query, req.session.uid, function(err, rows) {
                    if(err) callback(err);
                    var price = [0,0,0];  // 판매 총액 / 결제 대기 / 결제 완료
                    if(rows[0]) {
                        rows.forEach(function (element, index) {
                            price[Number(element.a_status)] += element.b_price;
                        });
                        price[0] = price[1] + price[2]; // 판매 총액 구하기
                    }
                    callback(null, price);
                });
            }
        ], function(err, results) {
            if(err) console.log(err);
            res.render('mypage/incomes', {
                income: results[0],
                price: results[1],
                session: req.session
            });
            connection.release();
        });
    });
});

module.exports = router;
