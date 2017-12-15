var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var upload = require('../../config.js').upload;

router.put('/', upload.single('image'), function(req, res) {
    var body = req.body;
    var tel = body.tel;
    var img = (req.file) ? req.file.filename : ((body.image) ? body.image : 'no_image.jpg');

    pool.getConnection(function (err, connection) {
        var query = "UPDATE user SET u_tel=?, u_img=? WHERE uid=?";
        connection.query(query, [tel, img, req.session.uid], function (err) {
            if (err) console.log(err);
            req.session.tel = tel;
            req.session.img = img;
            res.redirect('/mypage');
            connection.release();
        });
    });
});

module.exports = router;
