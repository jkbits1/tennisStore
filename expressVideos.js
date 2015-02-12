/**
 * Created by jk on 27/12/14.
 */

var express = require('express');
var fs = require('fs');
var split = require('split');
var mongoose = require('mongoose');

var getFolderList = require('./fileParse');
var pathInfo = require('./pathInfo');
var seedDb = require('./seedDb');

var app = express();

// connect to db
var progDetails = seedDb.setUpDb(seedDb.mainDbName);

app.all('*', function (req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/folders', function (req, res) {

  var pathList = [];

  function processLine(line) {

      if (line === null || line === undefined || line.length === 0) {
        return;
      }
      var path = pathInfo.getPathInfo(line);
      pathList.push(path);
  }

  function end() {

    //if (err) {
    //
    //  res.send(err);
    //}

    res.send({
      paths: pathList
    });
  }

  pathInfo.queryInfoFile(processLine, end);
});

function getMongoData(res) {

  progDetails.find({}, function(err, docs) {

    res.send(docs);
    //res.send({
    //
    //  paths: docs
    //});
  });
}

app.get('/foldersDb', function (req, res) {

  getMongoData(res);
});

// as a default, currently get the first line from the file and use that.
app.get('/', function (req, res) {

  var lineCount = 0;

  function processLine (line) {

    var path = pathInfo.getPathInfo(line);
    lineCount++;
    if (lineCount === 1){

      getFolderList(path.path, function (err, list) {
        res.send({
          files: list
        });
      });
    }
  }

  pathInfo.queryInfoFile(processLine);
});

app.get('/:progId', function (req, res) {

  var lineCount = 0;
  var progId = +(req.params.progId);

  function processLine(line) {

    var path = pathInfo.getPathInfo(line);
    lineCount++;
    if (path.id === progId){

      getFolderList(path.path, function (err, list) {
        res.send({
          files: list
        });
      });
    }
  }

  pathInfo.queryInfoFile(processLine);
});

var server = app.listen(seedDb.appPort, function() {});
