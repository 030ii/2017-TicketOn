var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;

router.get('/', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var query = "SELECT * FROM user";
        connection.query(query, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));
            res.render('admin/users', {rows: rows});
            connection.release();
        });
    });
});

router.get('/:uid', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var query = "DELETE FROM user where uid=?";
        var querylist = "SELECT * FROM user";
        console.log(req.params.uid);
        connection.query(query, req.params.uid, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + rows);
            connection.release();

            pool.getConnection(function (err, connection) {
                connection.query(querylist, function (err, rows) {
                    if (err) console.error("err : " + err);
                    console.log("rows : " + JSON.stringify(rows));
                    res.render('admin/users', {rows: rows});
                    connection.release();
                });
            });

        });
    });
});


module.exports = router;
