var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');

router.get('/', function(req,res,next){
    if(!req.session.admin) {  // 관리자가 아니면
        res.redirect('/');
        return;
    }
    pool.getConnection(function (err, connection) {
        async.series([
            function(callback) {
                query = "SELECT * FROM user ORDER BY u_reg DESC";
                connection.query(query, function (err, rows) {
                    if(err) callback(err);
                    callback(null,rows);
                });
            },
            function(callback) {
                query = "SELECT count(*) AS cnt FROM user WHERE DATE(u_reg) = DATE(now())";
                connection.query(query, function (err, rows) {
                    if(err) callback(err);
                    callback(null, rows[0].cnt);
                });
            },
            function(callback) {
                query = "SELECT count(*) AS cnt FROM user WHERE EXTRACT(MONTH FROM DATE(u_reg)) = EXTRACT(MONTH FROM DATE(now()))";
                connection.query(query, function (err, rows) {
                    if(err) callback(err);
                    callback(null, rows[0].cnt);
                });
            }
        ], function(err, results) {
            if(err) console.log(err);
            res.render('admin/users', {
                user: results[0], //  회원 정보
                dCount: results[1], // 오늘의 가입자 수
                mCount: results[2], // 이 달의 가입자 수
                session: req.session
            });
            connection.release();
        });
    });
});

module.exports = router;
