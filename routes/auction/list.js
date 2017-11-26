var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;

router.get('/', function(req, res, next) {
    var queryStr = 'SELECT * FROM auction';
    pool.getConnection(function(err, connection) {
        connection.query(queryStr, function(err, auctions) {
            if(err) console.log("err: ", err);
            queryStr = 'SELECT * FROM bid';
            pool.getConnection(function(err, connection) {
                connection.query(queryStr, function(err, bids) {
                    if(err) console.log("err: ", err);
                    res.render('auction/list.ejs', {
                        auction: auctions,
                        bid: bids
                    });
                    connection.release();
                });
            });
            connection.release();
        });
    });
});

module.exports = router;
