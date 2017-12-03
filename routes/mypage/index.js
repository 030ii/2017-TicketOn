var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;


router.get('/', function(req, res, next){
    pool.getConnection(function (err, connection) {
        var query = "SELECT * FROM user";
        connection.query(query, function (err, rows) {
            if (err) console.error("err : " + err);
            req.session.id = rows[0].u_id;
            console.log("rows : " + JSON.stringify(rows));
            res.render('mypage/index', {rows: rows});
            connection.release();
        });
    });
});

router.get('/logout', function(req, res, next){
  req.session.destroy(function(err){
    if(err) console.error('err', err);
    res.send('<script>alert("로그아웃 되었습니다.");location.href="/";</script>');
  });
});


module.exports = router;
