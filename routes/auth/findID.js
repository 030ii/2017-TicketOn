var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;



router.get('/', function(req, res, next) {
    res.render('auth/findID');
});

router.post('/', function(req, res, next) {
    var body = req.body;
    var query = "SELECT * FROM user WHERE u_name=? and u_tel=?";
    pool.getConnection(function(err, connection) {
        connection.query(query, [body.name, body.tel], function(err, rows) {
            if(err){
            console.log("err: ", err);
            }else{
              if(body.name == rows[0].u_name && body.tel == rows[0].u_tel){
                    res.send('<script>alert("아이디는 '+ rows[0].u_id +' 입니다!");' +
                            'window.location.replace("/login");</script>');
              }else {
                res.send('<script>alert("이름, 전화번호가 일치하지 않습니다.");' +
                        'window.location.replace("/findID");</script>');
              }
            connection.release();
            }
        });
    });
});

module.exports = router;
