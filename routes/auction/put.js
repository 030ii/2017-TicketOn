var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var upload = require('../../config.js').upload;

router.get('/:aid', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        queryStr = "SELECT * FROM auction WHERE aid=?";
        connection.query(queryStr, req.params.aid, function(err, rows) {
            if(err) console.log(err);
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
    console.log('file: ', req.file);
    console.log('body: ', body);
    var img = '';
    if(body.img)
        img = body.img;
    else if(req.file)
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
