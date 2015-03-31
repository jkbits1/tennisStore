/**
 * Created by jk on 30/03/15.
 */

var fs = require('fs');
var path = require('path');

var filter = '.ts';

module.exports = function (folder, listFileName) {

  if (listFileName === undefined || listFileName.length === 0) {
    return console.error("no output file specified");
  }

  //NOTE: this will write over an existing file
  fs.open('listFileName', 'w+', function (err, fd) {
    if (err) {
      return console.error("failed to create or access output file");
    }

    var writeStream = fs.createWriteStream('',
      {
        flags: 'w+',
        fd: fd
      }
    );

    writeStream.on('finish', function () {
      console.error("all writes finished");
    });

    fs.readdir(folder, function (err, files) {
      if (err) {
        return console.error(err);
      }

      files.forEach(function (val, idx, arr) {
        console.error("val:", val);

        if (path.extname(val) !== '.ts') {
          return;
        }

        var written = writeStream.write(val + '\n');
      });

      writeStream.end();
    });
  });
};

