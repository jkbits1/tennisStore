/**
 * Created by jk on 13/01/16.
 */

var pathInfo = require('./pathInfo');
var seedDb = require('./seedDb');
var getFolderList = require('./fileParse');

var templatePath = require.resolve('./views/manageFolders.jade');
var templateFn = require('jade').compileFile(templatePath);

var progDetails = seedDb.setUpDb(seedDb.mainDbName);
var episodeDetails = seedDb.getDbEpisodeDetails(seedDb.mainDbName);

module.exports = {
  getFoldersFromFile: getFoldersFromFile,
  //getDefaultEpisodesInfo: getDefaultEpisodesInfo
  getFoldersFromDb: getFoldersFromDb,
  getProgrammeDetails: getProgrammeDetails,
  getEpisodesInfo: getEpisodesInfo,
  getEpisodeDetails: getEpisodeDetails,
  addPath: addPath,
  manageFolders: manageFolders
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

function ensureProgIdIsValidOrDefault (progId){
  if (isNaN(progId) || progId === undefined) {
    console.log("invalid progId, using default value");

    progId = seedDb.defaultEpisodeId;
  }

  return progId;
}

function getProgrammeDetails (req, res){
  var progId = ensureProgIdIsValidOrDefault(+(req.params.progId));
  var progName = "";
  var progSummary = "";

  console.log("getProgrammeDetails:", progId);

  progDetails.find({id: progId}, function (err, docs) {
    if (err) {
      console.error("getProgrammeDetails - find error:", err);
      res.send({info: "details not found"});
    }

    res.send(docs);
  });
}

function getEpisodesInfo (req, res) {
  var progId = ensureProgIdIsValidOrDefault(+(req.params.progId));
  var lineCount = 0;
  var progInfoFound = false;

  console.log("getEpisodesInfo: ", progId);

  function processPathInfo (pathInfo) {
    lineCount++;

    if (lineCount > 1) {
      return;
    }

    if (pathInfo._doc.id === progId) {
      progInfoFound = true;

      getFolderList(pathInfo._doc.path, function (err, list) {
        
        if (err) {
          console.log("getEpisodesInfo: no files found", err);

          return res.send({});
        }

        return res.send({ files: list });
      });
    }
  }

  progDetails.find({}, function (err, docs) {
    
    if (err) {
      console.error("getEpisodesInfo: db error -", err);

      return res.send({});
    }

    docs.forEach(processPathInfo);

    // no valid info found, redirect
    if (progInfoFound === false) {
      console.error("getEpisodesInfo: no episodes found");

      return res.send({});
    }
  });
}

function getEpisodeDetails (req, res) {
  var episodeId = +(req.params.episodeId);

  episodeDetails.find(
      {progId: episodeId}
      , function (err, docs) {
        if (err) {
          console.error("getEpisodeDetails - find error:", err);
          return res.send({info: "details not found"});
        }

        res.send(docs);
      });


}

function addPath (req, res) {
  var id = +(req.body.id);
  var path = req.body.path;
  var name = req.body.name;
  var summary = req.body.summary;

  console.error("id:", id);
  console.error("name:", name);
  console.error("path:", path);
  console.error("summary:", summary);

  progDetails.create({id: id, name: name, path: path, summary: summary}, function(err, result){
    if (err) {
      console.error("couldn't add path");
    }
    res.redirect('/manageFolders');
  });
}

function manageFolders (req, res) {
  progDetails.find({}, function (err, docs) {
    if (err) {
      console.error("manageFolders", err);
      res.redirect('/');
    }

    res.write(templateFn({ user: req.user,
      folders: docs
    }));
    res.end();
  });
}

