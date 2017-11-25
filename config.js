var mysql = require('mysql');
var crypto = require('crypto');

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
