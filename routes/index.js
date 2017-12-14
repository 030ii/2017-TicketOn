var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.name)  // 로그인 상태이면
        res.redirect('/auction');
    res.render('index', {
        session: req.session
    });
});
// 로그인 상태가 아니면 메인으로 이동
router.get('/*', function(req, res, next) {
    if(req.session.name)
        next();
    else
        res.redirect('/');
});
router.use('/', require('./auth/index'));

module.exports = router;
