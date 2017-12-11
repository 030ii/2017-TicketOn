var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;


router.get('/', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var query = "SELECT * FROM user WHERE uid=?";
        connection.query(query, req.session.uid, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));
            res.render('mypage/changeInfo', {
                user: rows[0],
                session: req.session
              });
            connection.release();
        });
    });
});

router.post('/', function(req, res, next){
    pool.getConnection(function (err, connection) {
        var tel = req.body.tel,
            uid = req.body.uid;
        var querylist = "SELECT * FROM user";
        var query = "UPDATE user set u_tel=? where uid=?";
        connection.query(query, [tel, uid], function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + rows);
        });

        pool.getConnection(function (err, connection) {
            connection.query(querylist, function (err, rows) {
                if (err) console.error("err : " + err);
                req.session.id = uid;
                console.log("rows : " + JSON.stringify(rows));

                res.render('mypage/index', {rows: rows});
                connection.release();
            });
        });

    });
});

module.exports = router;
