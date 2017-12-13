var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var decrypt = require('../../config.js').decrypt;

router.get('/', function(req, res, next) {
    res.render('auth/login');
});

var admin = 'admin@naver.com';
router.post('/', function(req, res, next) {
    var body = req.body;

    var query = "SELECT * FROM user WHERE u_id=?";
    pool.getConnection(function(err, connection) {
        connection.query(query, body.id, function(err, rows) {
            if(err) console.log("err: ", err);
            else if(rows[0]) {
              if(admin == rows[0].u_id){
                console.log('admin password ' + decrypt(rows[0].u_password));
                console.log('admin password ' + body.password);
                if(body.password == decrypt(rows[0].u_password)){
                      req.session.id = rows[0].u_id;
                      res.redirect('/admin');
                }else {
                      res.redirect('/login/fail2');
                }
              } else{
                console.log('user password ' + decrypt(rows[0].u_password));
                if(body.password == decrypt(rows[0].u_password)){
                      req.session.uid = rows[0].uid;
                      req.session.id = rows[0].u_id;
                      req.session.name = rows[0].u_name;
                      res.redirect('/auction');
                }else {
                      res.redirect('/login/fail2');
                }
              }
            }else {
              res.redirect('/login/fail1');
            }
            connection.release();
        });
    });
});

router.get('/fail1', function(req, res, next) {
  res.send('<script>alert("아이디가 존재하지 않습니다!");</script>');
});

router.get('/fail2', function(req, res, next) {
  res.send('<script>alert("비밀번호가 틀립니다!");</script>');
});

module.exports = router;
