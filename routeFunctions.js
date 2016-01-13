/**
 * Created by jk on 13/01/16.
 */

var pathInfo = require('./pathInfo');
var seedDb = require('./seedDb');

var progDetails = seedDb.setUpDb(seedDb.mainDbName);

module.exports = {
  getFoldersFromFile: getFoldersFromFile,
  //getDefaultEpisodesInfo: getDefaultEpisodesInfo
  getFoldersFromDb: getFoldersFromDb
};

// NOT IN USE
// as a default, currently get the first line from the file and use that.
//NOTE: revised to default to db access
function getDefaultEpisodesInfo (req, res) {
  // var for upcoming changes
  var episodePaths = [];
  var lineCount = 0;
  var progInfoFound = false;

  console.error('getDefaultEpisodesInfo - starting');

  //function processLine(line) {
  function processPathInfo(pathInfo) {
    //var path = pathInfo.getPathInfo(line);
    console.error('getDefaultEpisodesInfo - handling path info');

    lineCount++;
    if (lineCount === 1) {
      progInfoFound = true;
      getFolderList(pathInfo._doc.path, function (err, list) {
        if (err) {
          console.error("getDefaultEpisodesInfo", err);
          res.redirect('/');
        }

        res.send({
          files: list
        });
      });
    }
  }

  //pathInfo.queryInfoFile(processLine);
  progDetails.find({}, function (err, docs) {

    console.error('getDefaultEpisodesInfo - db responded');

    //NOTE: possibly may create endless loop here
    if (err) {
      console.error('getDefaultEpisodesInfo - error');
      return res.redirect('/');
    }

    docs.forEach(processPathInfo);

    // no valid info found, redirect
    if (progInfoFound === false) {
      console.error('getDefaultEpisodesInfo - no data, sending empty object');

      //NOTE: possibly may create endless loop here
      //res.redirect('/');
      res.send({});
    }
  });
}

function getFoldersFromFile (req, res) {
  var pathList = [];

  function processLine (line) {
    var path = undefined;

    if (line === null || line === undefined || line.length === 0) {
      return;
    }
    path = pathInfo.getPathInfo(line);
    pathList.push(path);
  }

  function end() {
    res.send({
      paths: pathList
    });
  }

  pathInfo.queryInfoFile(processLine, end);
}

function getFoldersFromDb (req, res) {

  console.error("folders db requested");

  progDetails.find({}, function(err, docs){

    console.error('folders db - db responded');

    if (err) {
      console.error("getFoldersFromDb", err);
      return res.send(401, "folders not found");
    }

    console.error("folders db - sending");

    res.send(docs);
  });
}

