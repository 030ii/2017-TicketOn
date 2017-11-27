var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;


router.get('/', function(req,res,next){

    pool.getConnection(function (err, connection) {
        // Use the connection
        var query = "SELECT * FROM user";
        connection.query(query, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.render('admin/users', {rows: rows});
            connection.release();

            // Don't use the connection here, it has been returned to the pool.
        });
    });
});

router.get('/users/:uid', function(req,res,next){
console.log(req.params.uid);
    pool.getConnection(function (err, connection) {
        // Use the connection
        var query = "DELETE FROM user where uid=?";
        console.log(req.params.uid);
        connection.query(query, req.params.uid, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('admin/users', {rows: rows});
            connection.release();

            // Don't use the connection here, it has been returned to the pool.
        });
    });
});


module.exports = router;
