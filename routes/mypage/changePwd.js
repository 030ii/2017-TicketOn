var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var encrypt = require('../../config.js').encrypt;
var decrypt = require('../../config.js').decrypt;
var async = require('async');

router.put('/', function(req, res) {
    var curPwd = req.body.curPwd;
    var newPwd = req.body.newPwd;
    pool.getConnection(function (err, connection) {
        async.waterfall([
            function(callback) {
                // 사용자 비밀번호 조회
                query = "SELECT u_password FROM user WHERE uid=?";
                connection.query(query, req.session.uid, function (err, rows) {
                    if (err) callback(err);
                    else if(curPwd == decrypt(rows[0].u_password)) {  // 현재 비밀번호가 일치하면
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                });
            },
            function(isCorrect, callback) {
                if(isCorrect) { // 현재 비밀번호가 일치하면
                    // 사용자 비밀번호 수정
                    query = "UPDATE user SET u_password=? WHERE uid=?";
                    connection.query(query, [encrypt(newPwd), req.session.uid], function (err) {
                        if (err) callback(err);
                        callback(null, true);
                    });
                } else {  // 현재 비밀번호가 일치하지 않으면
                    callback(null, false);
                }
            }
        ], function(err, result) {
            if(err) console.log(err);
            res.send(result);
            connection.release();
        });
    });
});

module.exports = router;
