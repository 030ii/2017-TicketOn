var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      session: req.session
  });
});

router.use('/', require('./auth/index'));
router.use('/mypage', require('./mypage/index'));
router.use('/admin', require('./admin/index'));

module.exports = router;
