/**
 * Created by jk on 26/12/14.
 */

var getFolderList = require('./fileParse');

getFolderList("H:\\Video\\SG3\\TVee\\SGATE AT", function (err, list) {

  list.forEach(function (file) {

    //console.log("file:", file);
    console.log("Prog:", file.fileName, file.date.toDateString(), file.time);
  });
});
