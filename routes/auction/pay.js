var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');

router.post('/', function(req, res, next) {
    var body = req.body;
    pool.getConnection(function(err, connection) {
        query = "INSERT INTO pay(uid,aid,p_price) VALUES(?,?,?)";
        connection.query(query, [req.session.uid, body.aid, body.price], function(err) {
            if(err) console.log(err);
            res.send(true);
            connection.release();
        });
    });
});

module.exports = router;
