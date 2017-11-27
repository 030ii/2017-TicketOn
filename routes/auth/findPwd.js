var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var decrypt = require('../../config.js').decrypt;


router.get('/', function(req, res, next) {
    res.render('auth/findPwd');
});

router.post('/', function(req, res, next) {
    var body = req.body;
    var query = "SELECT * FROM user WHERE u_id=?";
    pool.getConnection(function(err, connection) {
        connection.query(query, body.id, function(err, rows) {
            if(err){
            console.log("err: ", err);
            }else{
              if(body.id == rows[0].u_id){
                console.log(rows);
                    res.send('<script>alert("비밀번호는 '+ decrypt(rows[0].u_password) +' 입니다!");' +
                            'window.location.replace("/login");</script>');
              }else {
                res.send('<script>alert("이름, 전화번호가 일치하지 않습니다.");' +
                        'window.location.replace("/findPwd");</script>');
              }
            connection.release();
            }
        });
    });
});

module.exports = router;
