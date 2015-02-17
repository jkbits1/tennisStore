/**
 * Created by jk on 01/02/15.
 */

var fs = require("fs");
var split = require("split");

module.exports = {
  queryInfoFile: queryInfoFile,
  getPathInfo: getPathInfo
};

function getPathInfo (line){
  var pathDetails = line.split(',');
  var path = {};
  //var regexPath = /[a-zA-Z0-9\\\:]*/;
  //var path = getFileInfo(line, regexPath);
  //console.log(path);

  path.path = pathDetails[0];
  path.name = pathDetails[1];
  path.id = +(pathDetails[2]);

  return path;
};

function queryInfoFile (cbLine, cbEnd) {
  var pathList = [];

  fs.createReadStream('episodesList2a.txt').pipe(split())
    .on('data', cbLine)
    .on('end', function (){
      if (cbEnd !== undefined && cbEnd !== null) {
        cbEnd();
      }
    })
    //.on('error', function(err) {
    //
    //  cb(err);
    //})
  ;
}
