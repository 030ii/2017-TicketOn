var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;

router.put('/', function(req, res) {
    var bank = req.body.bank;
    var number = req.body.number;
    var holder = req.body.holder;
    pool.getConnection(function (err, connection) {
        // 계좌정보 수정
        query = "UPDATE user SET u_account=?, u_bank=?, u_holder=? WHERE uid=?";
        connection.query(query, [number, bank, holder, req.session.uid], function (err) {
            if (err) console.log(err);
            res.send(true);
            connection.release();
        });
    });
});

module.exports = router;
