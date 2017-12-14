var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var decrypt = require('../../config.js').decrypt;

router.post('/', function(req, res, next) {
    var body = req.body;
    // 입력한 이메일의 사용자정보 조회
    var query = "SELECT * FROM user WHERE u_id=?";
    pool.getConnection(function(err, connection) {
        connection.query(query, body.id, function(err, rows) {
            if(err) console.log("err: ", err);
            else if(rows[0]) {  // 이메일이 일치하는 사용자정보가 존재하면
                if(body.password == decrypt(rows[0].u_password)) {  // 비밀번호가 일치하면
                      req.session.uid = rows[0].uid;
                      req.session.id = rows[0].u_id;
                      req.session.name = rows[0].u_name;
                      res.send(true);
                } else {  // 비밀번호가 다르면
                    res.send(false);
                }
            } else {  // 아이디가 없으면
                res.send(false);
            }
            connection.release();
        });
    });
});

module.exports = router;
