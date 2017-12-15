var express = require('express');
var router = express.Router();
var pool = require('../config.js').pool;

router.get('/', function(req, res, next) {
    if(req.session.admin)
        res.redirect('/admin');
    else if(req.session.name)  // 로그인 상태이면
        res.redirect('/auction');

    pool.getConnection(function(err, connection) {
        // 마감시간 순으로 모든 경매 정보 조회
        query = "SELECT * FROM auction WHERE a_status='0'";
        connection.query(query, function(err, auctions) {
            if(err) console.log(err);
            auctions.forEach(function(element, index) {
                if(element.a_deadline.getTime() < Date.now()) // 마감시간이 지나면
                    changeStatus(element.aid);  // 경매 상태 변경
            });
        });
    });

    res.render('index', {
        session: req.session
    });
});
// 로그인 상태가 아니면 메인으로 이동
router.get('/*', function(req, res, next) {
    if(req.session.name)
        next();
    else
        res.redirect('/');
});
router.use('/', require('./auth/index'));

module.exports = router;

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
