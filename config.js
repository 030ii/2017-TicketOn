var mysql = require('mysql');
var crypto = require('crypto');
var multer = require('multer');
var path = require('path');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// mysql pool
exports.pool = mysql.createPool({
    connectionLimit: 20,
    host: 'localhost',
    user: 'root',
    password: 'root',
    prot: 3306,
    database: 'ticketon'
});

// crypto 암호화 - 복호화
key = 'v1er5ys32ecr@et!Ke^y2s';
exports.encrypt = function (text) {
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var encipheredContent = cipher.update(text, 'utf8', 'hex');
    encipheredContent += cipher.final('hex');

    return encipheredContent;
}
exports.decrypt = function (text) {
    var decipher = crypto.createDecipher('aes-256-cbc', key);
    var decipheredPlaintext = decipher.update(text,'hex','utf8');
    decipheredPlaintext += decipher.final('utf8');

    return decipheredPlaintext;
}

// nodemailer 메일 세팅
exports.transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
          user: 'ojland17@gmail.com',
          pass: 'dhlwnskfk'
        }
}));

// multer 파일 업로드
exports.upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  })
});

exports.admin = {
    "id" : "root@root.com",
    "password" : "root1234"
}
