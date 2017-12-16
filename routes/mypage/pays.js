var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var async = require('async');

router.get('/', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        async.series([
          function(callback) {
              query = "SELECT A.a_title, B.b_price, P.p_time FROM pay AS P JOIN bid AS B JOIN auction AS A WHERE P.uid=? AND "
                      + "B.b_price = (SELECT MAX(b_price) FROM bid WHERE aid=A.aid) AND P.aid=A.aid AND A.a_status<>'0'";
              connection.query(query, req.session.uid, function(err, rows) {
                  if(err) callback(err);
                  callback(null, rows);
              });
          },
          function(callback) {
              query = "SELECT A.a_title, A.a_status, B.b_price FROM auction AS A JOIN user AS U JOIN bid AS B WHERE A.uid=? "
              + "AND U.uid=B.uid AND B.b_price=(SELECT MAX(b_price) FROM bid WHERE aid=A.aid) AND A.a_status='2'";
              connection.query(query, req.session.uid, function(err, rows) {
                  if(err) callback(err);
                  var price = 0;  // 결제 총액
                  rows.forEach(function(element, index) {
                      price += element.b_price;
                  });
                  callback(null, price);
              });
          }
        ], function(err, results) {
            if(err) console.log(err);
            res.render('mypage/pays', {
                pay: results[0],
                price: results[1],
                session: req.session
            });
            connection.release();
        })
    });
});

module.exports = router;
