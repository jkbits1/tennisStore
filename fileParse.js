/**
 * Created by jk on 25/12/14.
 */

var fs = require('fs');
var path = require('path');

var filterExtension = ".ts";

module.exports = getFolderSortedList;

function getFolderSortedList (folder, callback){
  fs.readdir(folder, function (err, files) {
    var videoList = [];

    if (err) {
      console.error(err);

      return callback(err);
    }

    files = files.filter(function (file) {
      if (path.extname(file) === filterExtension) {
        return true;
      }
      else {
        return false;
      }
    });

    videoList = files.map(function (file) {
      var regexFileName = /[a-zA-Z\s]*/;
      var regexDate     = /_[0-9]*_/; // date plus underscores
      var regexTime     = /[0-9]*[.]/; // time
      var fileName      = undefined;
      var fileTime      = undefined;
      var fileDate      = undefined;
      var videoItem     = undefined;

      function getFileInfo (fileName, regex) {
        var items = fileName.match(regex);
        var itemInfo = undefined;

        items.forEach(function (item) {
          //console.log("matches:", item);
          itemInfo = item;
        });

        return itemInfo;
      }

      fileName = getFileInfo(file, regexFileName);
      fileDate = getFileInfo(file, regexDate);
      //console.log();
      //console.log(file);
      //console.log(fileName);
      //console.log(fileDate);

      var date2 = fileDate.split("");
      var date3 = date2.splice(1, date2.length-2);
      var date4 = date3.join("");
      var year = date3.splice(0, 4).join("");
      var mon = date3.splice(0, 2).join("");
      var day = date3.splice(0, 2).join("");
      //console.log(date4);
      //console.log("date:", year, mon, day);

      fileDate = new Date();
      fileDate.setFullYear(year);
      fileDate.setMonth(mon - 1);
      fileDate.setDate(day);
      fileTime = getFileInfo(file, regexTime);
      //console.log("Date:", fileDate.toDateString());
      //console.log("Prog:", fileName, fileDate.toDateString(), fileTime);
      //console.log(fileTime);

      videoItem = {};
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
