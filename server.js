var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var login = require('./routes/auth/login');
var register = require('./routes/auth/register');
var auctionPost = require('./routes/auction/post');
var list = require('./routes/auction/list');
var findID = require('./routes/auth/findID');
var findPwd = require('./routes/auth/findPwd');
var admin = require('./routes/admin/index');
var mypage = require('./routes/mypage/index');
var users = require('./routes/admin/users');
var changeInfo = require('./routes/mypage/changeInfo');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: '^!@dntkdcodudwlgh!@#',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/login', login); // @TODO 챙 : 로그인 페이지 별도로 없음~ 로그인하는 것은 모달로 바꿔서 고쳐야 함
app.use('/register', register); // @TODO 챙 : 이것도 로그인 페이지와 마찬가지로 회원가입 페이지가 별도로 존재하지 않음
app.use('/auctionPost', auctionPost);
app.use('/auctionList', list);
app.use('/findID', findID);
app.use('/findPwd', findPwd);
app.use('/admin', admin);
app.use('/mypage', mypage);
app.use('/users', users);
app.use('/changeInfo', changeInfo);

app.get('/users', users)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
