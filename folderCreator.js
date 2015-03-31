/**
 * Created by jk on 31/03/15.
 */

var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = function (folderName, fileOfFileNames) {
  if (folderName === undefined || folderName.length === 0) {
    return console.error("no folder name");
  }

  if (fileOfFileNames === undefined || fileOfFileNames.length === 0) {
    return console.error("no file name");
  }

  fs.open(fileOfFileNames, 'r', function (err, fd) {
    if (err) {
      return console.error("failed to open file");
    }

    mkdirp(folderName, function (err) {
      if (err) {
        return console.error(err);
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
          console.error();

          fs.open(newFileName, 'w', function (err, fd) {
            if (err) {
              return console.error("could not create file:", newFileName);
            }

            console.error("created file:", newFileName);
          });
        });
      });
      readStream.on('end', function () {
        console.error("all items read");
      });
    });
  });
};
