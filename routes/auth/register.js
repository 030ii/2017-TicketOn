var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var decrypt = require('../../config.js').decrypt;
var encrypt = require('../../config.js').encrypt;
var async = require('async');

router.get('/', function(req, res, next) {
    res.render('auth/register');
});

router.post('/', function(req, res, next){
    var body = req.body;
    pool.getConnection(function(err, connection) {
        async.waterfall([
            function(callback) {
                // 이메일이 존재하는지 조회
                queryStr = 'SELECT * FROM user WHERE u_id=?';
                connection.query(queryStr, body.id, function(err,rows) {
                    if(err) callback("err : ", err);
                    callback(null, (rows[0] ? true : false)); // 존재하면 true
                });
            },
            function(exist, callback) {
                if(!exist) {  // 이메일이 존재하지 않으면
                    var inputs = [body.name, body.id, encrypt(body.password), body.tel];
                    // 회원정보 삽입
                    queryStr = 'INSERT INTO user(u_name, u_id, u_password, u_tel) values(?,?,?,?)';
                    connection.query(queryStr, inputs, function(err) {
                        if(err) callback("err: ", err);
                    });
                }
                callback(null, exist);
            }
        ], function(err, result) {
            if(err) console.log(err);
            res.send(result);
            connection.release();
        });
    });
});

module.exports = router;
