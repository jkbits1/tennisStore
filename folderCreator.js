/**
 * Created by jk on 31/03/15.
 */

var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = function (folderName, fileOfFileNames, cb) {
  if (folderName === undefined || folderName.length === 0) {
    console.error("no folder name");
    return cb("no folder name");
  }

  if (fileOfFileNames === undefined || fileOfFileNames.length === 0) {
    console.error("no file name");
    return cb("no file name");
  }

  fs.open(fileOfFileNames, 'r', function (err, fd) {
    if (err) {
      console.error("failed to open file:", err);
      return cb("failed to open file");
    }

    mkdirp(folderName, function (err) {
      if (err) {
        console.error(err);
        return cb("failed to create folder");
      }

      var readStream = fs.createReadStream('', {fd: fd});

      readStream.on('data', function (chunk) {
        var listOfFilenames = chunk.toString();
        var fileNames = listOfFilenames.split('\n');

        fileNames.forEach(function (fileName) {
          if (fileName.length === 0) {
            return;
          }

          var newFileName = folderName + '/' + fileName;

          //console.error(folderName);
          //console.error(listFilename);
          console.error(newFileName);

          fs.open(newFileName, 'w', function (err, fd) {
            if (err) {
              console.error("could not create file:", newFileName);
              return cb("could not create file: " + newFileName);
            }

            console.error("created file:", newFileName);
          });
        });
      });
      readStream.on('end', function () {
        console.error("all items read");

        return cb(null, "all items read");
      });
    });
  });
};
