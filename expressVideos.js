/**
 * Created by jk on 27/12/14.
 */

var express = require('express');
var fs = require('fs');
var split = require('split');

var getFolderList = require('./fileParse');


var app = express();

app.all('*', function (req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  next();
});

app.get('/folders', function (req, res) {

  var pathList = [];

  //fs.createReadStream('episodesList2.txt').pipe(split())
  fs.createReadStream('episodesList2a.txt').pipe(split())
    .on('data', function (line) {

      if (line === null || line === undefined || line.length === 0) {

        return;
      }


      var pathDetails = line.split(',');

      //var regexPath = /[a-zA-Z0-9\\\:]*/;
      //var path = getFileInfo(line, regexPath);
      //console.log(path);

      var path = {};

      path.path = pathDetails[0];
      path.name = pathDetails[1];
      path.id = +(pathDetails[2]);

        pathList.push(path);
    })
    .on('end', function() {

      res.send({
        paths: pathList
      });
    });
});

//function getFileInfo(fileName, regex) {
//
//  var items = fileName.match(regex);
//  var itemInfo = undefined;
//
//  items.forEach(function (item) {
//
//    //console.log("matches:", item);
//
//    itemInfo = item;
//  });
//
//  return itemInfo;
//}

app.get('/', function (req, res) {

  var lineCount = 0;

  // currently get the first line from the file and use that.
  // Will enable rest api param to select specific line.
  fs.createReadStream('episodesList.txt').pipe(split()).on('data', function (line) {
  //fs.createReadStream('./episodesList.txt').pipe(split()).on('data', function (line) {

    lineCount++;

    if (lineCount === 1){

      getFolderList(
        line
        , function (err, list) {

        res.send({
          files: list
        });
      });
    }
  });
});

app.get('/:progId', function (req, res) {

  var lineCount = 0;

  var progId = +(req.params.progId);

  // currently get the first line from the file and use that.
  // Will enable rest api param to select specific line.
  fs.createReadStream('episodesList.txt').pipe(split()).on('data', function (line) {
    //fs.createReadStream('./episodesList.txt').pipe(split()).on('data', function (line) {

    lineCount++;

    if (lineCount === progId){

      getFolderList(
        line
        , function (err, list) {

          res.send({
            files: list
          });
        });
    }
  });
});

var server = app.listen(3030, function() {});
