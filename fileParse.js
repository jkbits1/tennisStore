/**
 * Created by jk on 25/12/14.
 */

var fs = require('fs');
var path = require('path');

fs.readdir("H:\\Video\\SG3\\TVee\\SGATE AT", function (err, files) {

  if (err) {
    console.error(err);
  }

  files = files.filter(function (file) {

    if (path.extname(file) === ".ts") {
      return true;
    }
    else {
      return false;
    }


  });

  files.forEach(function(file) {

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

    console.log("Prog:", fileName, fileDate.toDateString(), fileTime);
    //console.log(fileTime);



  });
});