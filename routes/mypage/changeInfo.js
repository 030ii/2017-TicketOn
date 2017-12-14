var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var upload = require('../../config.js').upload;

router.put('/', upload.single('profile-image'), function(req, res) {
    var tel = req.body.tel,
        img = req.file.filename;
    console.log('img: ', img);
    console.log('body: ', req.body);
    console.log('file: ', req.file);
    pool.getConnection(function (err, connection) {
        var query = "UPDATE user SET u_tel=?, u_img=? WHERE uid=?";
        connection.query(query, [tel, img, req.session.uid], function (err) {
            if (err) console.log(err);
            res.send(true);
            connection.release();
        });
    });
});

module.exports = router;
