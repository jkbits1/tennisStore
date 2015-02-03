/**
 * Created by jk on 25/12/14.
 */

var fs = require('fs');
var path = require('path');

module.exports = getFolderSortedList;

function getFolderSortedList(folder, callback){

  fs.readdir(folder, function (err, files) {

    var videoList = [];

    if (err) {
      return console.error(err);
    }

    files = files.filter(function (file) {

      if (path.extname(file) === ".ts") {
        return true;
      }
      else {
        return false;
      }
    });

    videoList = files.map(function(file) {

      var videoItem = {};

      function getFileInfo(fileName, regex) {

        var items = fileName.match(regex);
        var itemInfo = undefined;

        items.forEach(function (item) {

          //console.log("matches:", item);

          itemInfo = item;
        });

        return itemInfo;
      }

      var fileName = undefined;
      var fileDate = undefined;
      var fileTime = undefined;

      //console.log();
      //console.log(file);

      var regexFileName = /[a-zA-Z\s]*/;
      fileName = getFileInfo(file, regexFileName);
      //console.log(fileName);

      var regexDate = /_[0-9]*_/; // date plus underscores
      fileDate = getFileInfo(file, regexDate);
      //console.log(fileDate);
      var date2 = fileDate.split("");
      var date3 = date2.splice(1, date2.length-2);
      var date4 = date3.join("");
      //console.log(date4);

      var year = date3.splice(0, 4).join("");
      var mon = date3.splice(0, 2).join("");
      var day = date3.splice(0, 2).join("");

      //console.log("date:", year, mon, day);

      var fileDate = new Date();
      fileDate.setFullYear(year);
      fileDate.setMonth(mon - 1);
      fileDate.setDate(day);

      //console.log("Date:", fileDate.toDateString());


      var regexTime = /[0-9]*[.]/; // time
      fileTime = getFileInfo(file, regexTime);

      //console.log("Prog:", fileName, fileDate.toDateString(), fileTime);
      //console.log(fileTime);

      videoItem.fileName = fileName;
      videoItem.date = fileDate;
      videoItem.time = fileTime;

      return videoItem;
    });

    videoList.sort(function (a, b) {

      if (a.date > b.date) {
        return 1;
      }

      if (a.date < b.date) {
        return -1;
      }

      return 0;
    });

    callback(null, videoList);
  });
}
