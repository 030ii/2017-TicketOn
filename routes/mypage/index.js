var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;

router.get('/', function(req, res, next){
    pool.getConnection(function (err, connection) {
        var query = "SELECT * FROM user";
        connection.query(query, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));
            res.render('mypage/index', {
                rows: rows,
                session: req.session
            });
            connection.release();
        });
    });
});

router.use('/bids', require('./bids'));
router.use('/changeInfo', require('./changeInfo'));
router.use('/changePwd', require('./changePwd'));
router.use('/deposits', require('./deposits'));
router.use('/pays', require('./pays'));
router.use('/requests', require('./requests'));
router.use('/sucbids', require('./sucbids'));

module.exports = router;
