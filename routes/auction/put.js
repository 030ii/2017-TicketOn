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

router.put('/:aid', upload.single('img'), function(req, res, next) {
    var body = req.body;
    var img = ''; // 이미지 파일이름을 저장할 변수
    if(body.img)  // 이미 존재하는 파일의 경우
        img = body.img;
    else if(req.file) // 새로 추가한 파일의 경우
        img = req.file.filename;

    var queryStr = 'UPDATE auction SET a_category=?, a_title=?, a_content=?, a_img=? WHERE aid=?';
    var inputs = [body.category, body.title, body.content, img, req.params.aid];
    pool.getConnection(function(err, connection) {
        connection.query(queryStr, inputs, function(err, rows) {
            if(err) console.log("err: ", err);
            res.redirect('/auction');
            connection.release();
        });
    });
});

module.exports = router;
