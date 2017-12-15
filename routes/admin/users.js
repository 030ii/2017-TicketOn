var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');

router.get('/', function(req,res,next){
    pool.getConnection(function (err, connection) {
        async.series([
            function(callback) {
                query = "SELECT * FROM user";
                connection.query(query, function (err, rows) {
                    if(err) callback(err);
                    callback(null,rows);
                });
            },
            function(callback) {
                query = "SELECT * FROM bid";
                connection.query(query, function (err, rows) {
                    if(err) callback(err);
                    callback(null,rows);
                });
            }
        ], function(err, results) {
            if(err) console.log(err);
            res.render('admin/users', {
                session: req.session
            });
            connection.release();
        });
    });
});

module.exports = router;
