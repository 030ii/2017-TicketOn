var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;

router.get('/info', function(req, res) {
    pool.getConnection(function(err, connection) {
        // 사용자 정보 조회
        query = "SELECT * FROM user WHERE uid=?";
        connection.query(query, req.query.uid, function(err, rows) {
            if(err) console.log();
            else if (rows[0]) {
                res.send(rows[0]);
            } else {
                res.send(false);
            }
        });
    });
});
router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/register', require('./register'));
router.use('/findID', require('./findID'));
router.use('/findPwd', require('./findPwd'));

module.exports = router;
