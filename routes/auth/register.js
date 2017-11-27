var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var decrypt = require('../../config.js').decrypt;
var encrypt = require('../../config.js').encrypt;

router.get('/', function(req, res, next) {
    res.render('auth/register');
});

router.post('/', function(req, res, next){
    var body = req.body;
    var query = 'INSERT INTO user(u_name, u_id, u_password, u_tel) values(?,?,?,?)';
    var queryCk = 'SELECT * FROM user';
    var newPwd = encrypt(body.password);
    var inputs = [body.name, body.id, newPwd, body.tel];


    pool.getConnection(function(err, connection){
      connection.query(queryCk, function(err,rows){
        if(err) console.log("err : ", err);

        for(var i = 0; i < rows.lenght; i++) {
            if (body.id == rows[i].u_id) {
                res.send('<script>alert("중복아이디가 있습니다.");window.location.href="/register";</script>');
                return;
            }
          }
        connection.release();
      });
    });

    pool.getConnection(function(err, connection) {
          connection.query(query, inputs, function(err, rows) {
              if(err) console.log("err: ", err);
          });
          res.redirect('/login');
          connection.release();
    });
});

module.exports = router;
