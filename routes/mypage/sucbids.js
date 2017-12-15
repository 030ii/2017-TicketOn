var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');

router.get('/', function(req, res){
    pool.getConnection(function(err, connection) {
        async.series([
            function(callback) {
                query = "SELECT A.aid, A.a_img, A.a_category, A.a_title, A.a_min_price, U.u_name, B.b_price FROM auction AS A JOIN bid AS "
                        + "B JOIN user AS U WHERE B.uid=? AND B.b_price = (SELECT MAX(b_price) FROM bid WHERE aid=A.aid)"
                        + "AND U.uid=A.uid AND A.a_status='1'";
                connection.query(query, req.session.uid, function(err, rows) {
                    if(err) callback(err);
                    callback(null, rows);
                });
            }
        ], function(err, results) {
            if(err) console.log(err);
            res.render('mypage/sucbids', {
                sucbid: results[0],
                session: req.session
            });
            connection.release();
        });
    });
});

module.exports = router;
