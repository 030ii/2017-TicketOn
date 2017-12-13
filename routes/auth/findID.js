var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;



router.get('/', function(req, res, next) {
    res.render('auth/findID');
});

router.post('/', function(req, res, next) {
    var body = req.body;
    var query = "SELECT u_id FROM user WHERE u_name=? and u_tel=?";
    pool.getConnection(function(err, connection) {
        connection.query(query, [body.name, body.tel], function(err, rows) {
            if(err) console.log("err: ", err);
            else if(rows[0]) {
                res.send(rows[0].u_id)
            } else {
                res.send(false);
            }
            connection.release();
        });
    });
});

module.exports = router;
