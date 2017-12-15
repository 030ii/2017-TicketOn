var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var upload = require('../../config.js').upload;

router.get('/', function(req, res, next) {
    // 경매 등록 페이지 렌더링
    res.render('auction/post', {
        session: req.session
    });
});

router.post('/', upload.single('image'), function(req, res, next) {
    var body = req.body;
    var date = new Date();  // 마감시간을 저장할 객체
    console.log(req.file);
    date.setTime(date.getTime() + (Number(body.deadline) * 1000 * 60 * 60)); // 마감시간 계산
    var inputs = [req.session.uid, body.category, body.title, body.content,
                  req.file.filename, body.minPrice, date];
    pool.getConnection(function(err, connection) {
        var queryStr = 'INSERT INTO auction(uid, a_category, a_title, a_content, a_img,'
                      + ' a_min_price, a_deadline) VALUES(?,?,?,?,?,?,?)';
        connection.query(queryStr, inputs, function(err, rows) {
            if(err) console.log("err: ", err);
            res.redirect('/auction');
            connection.release();
        });
    });
});

module.exports = router;
