/**
 * Created by jk on 01/04/15.
 */

'use strict'

var fs = require('fs');

module.exports = function (folderName, callback) {
  fs.readdir(folderName, function (err, files) {
    if (err) {
      return callback(err);
    }

    callback(files.length);
  });
};