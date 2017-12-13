var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var decrypt = require('../../config.js').decrypt;
var transporter = require('../../config.js').transporter;

router.post('/', function(req, res, next) {
    var body = req.body;
    // 입력한 이메일의 회원 정보 조회
    var query = "SELECT * FROM user WHERE u_id=?";
    pool.getConnection(function(err, connection) {
        connection.query(query, body.id, function(err, rows) {
            if(err) console.log("err: ", err);
            else if(rows[0]) {
                sendMail(req, rows[0].u_id, rows[0].u_password); // 메일 전송
                res.send(true);
            } else {
                res.send(false);
            }
            connection.release();
        });
    });
});

module.exports = router;

function sendMail(req, id, password) {
    // 전송할 메일의 내용
    var mailOptions = {
                      from: '티켓온 <ojland17@gmail.com>',
                      to: id,
                      subject: '[티켓온]비밀번호 정보',
                      html: '<div align="center" style="border-radius:50px;background-color:#63d3f5;width:35vh;padding:15px;">'
                          + '<h3>회원님의 비밀번호는</h3><h2 style="color:white"> "' + decrypt(password) + '" </h2><h3>입니다.</h3>'
                          + '<a style="border-radius:20px;padding:15px;text-decoration:none;text-align:center;font-size:2.5em;font-weight:bold;'
                          + 'background-color:#fff;" href="http://' + req.get('host') + '/">티켓온 바로가기</a></div>'
                  };
    // 메일 전송
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) return console.log(error);
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}
