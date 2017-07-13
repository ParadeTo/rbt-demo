/**
 * 工具类
 * Created by ayou on 2017/4/14.
 */
var path = require('path'),
  fs = require('fs');

class Utils {
  static getClientIp() {
    var addressIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var reg = /(\d{1,3}\.){3}\d{1,3}/;
    addressIp = (addressIp === '::1' ? '127.0.0.1' : addressIp);
    if(addressIp.match(reg)){
      return addressIp.match(reg)[0];
    }
    return '';
  }

  static mkdirsSync(dirname, mode) {
    function mkdirsSync(dirname, mode) {
      if (fs.existsSync(dirname)) {
        return true;
      } else {
        if (mkdirsSync(path.dirname(dirname), mode)) {
          fs.mkdirSync(dirname, mode);
          return true;
        }
      }
    }
    mkdirsSync(dirname, mode);
  }
}

module.exports = Utils;