var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var decrypt = require('../../config.js').decrypt;
var encrypt = require('../../config.js').encrypt;

var users;
router.get('/', function(req, res, next) {
  var query = 'SELECT * FROM user';
    pool.getConnection(function(err, connection){
      connection.query(query, function(err,rows){
        if(err) console.log("err : ", err);
        users = rows;
        res.render('auth/register.ejs');
        connection.release();
    });
  });
});

router.post('/', function(req, res, next){
  var body = req.body;
    var query = 'INSERT INTO user(u_name, u_id, u_password, u_tel) values(?,?,?,?)';

    // var newID = Number(users[users.length-1].u_id) + 1;
    var newPwd = encrypt(body.password);
    var inputs = [body.name, body.id, newPwd, body.tel];

    for(var i = 0; i < users.length; i++) {
        if (body.id == users[i].u_id) {
            res.send('<script>alert("중복아이디가 있습니다.");window.location.href="/register";</script>');
            return;
        }
      }
    pool.getConnection(function(err, connection) {
          connection.query(query, inputs, function(err, rows) {
              if(err) console.log("err: ", err);
          });
          res.redirect('/login');
          connection.release();
    });
});

module.exports = router;
