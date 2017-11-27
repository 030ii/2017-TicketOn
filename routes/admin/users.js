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
        console.log(req.params.uid);
        connection.query(query, req.params.uid, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + rows);
            res.redirect('admin/users');
            connection.release();
        });
    });
});


module.exports = router;
