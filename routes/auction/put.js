var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var upload = require('../../config.js').upload;

router.get('/:aid', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        queryStr = "SELECT * FROM auction WHERE aid=?";
        connection.query(queryStr, req.params.aid, function(err, rows) {
            if(err) console.log(err);
            // 경매 수정 페이지 렌더링
            res.render('auction/put', {
                auction: rows[0],
                session: req.session
            });
            connection.release();
        });
    });
});

router.put('/:aid', upload.single('image'), function(req, res, next) {
    var body = req.body;
    console.log('body: ', body);
    console.log('file: ', req.file);
    var img = ''; // 이미지 파일이름을 저장할 변수
    img = (req.file) ? req.file.filename : ((body.image) ? body.image : 'no_image.jpg');
    console.log('img: ', img);

    var date = new Date();  // 마감시간을 저장할 객체
    date.setTime(date.getTime() + (Number(body.deadline) * 1000 * 60 * 60)); // 마감시간 계산

    var queryStr = 'UPDATE auction SET a_category=?, a_title=?, a_content=?, a_img=?, a_deadline=? WHERE aid=?';
    var inputs = [body.category, body.title, body.content, img, date, req.params.aid];
    pool.getConnection(function(err, connection) {
        connection.query(queryStr, inputs, function(err, rows) {
            if(err) console.log("err: ", err);
            res.redirect('/auction/' + req.params.aid);
            connection.release();
        });
    });
});

module.exports = router;
