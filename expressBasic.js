/**
 * Created by jk on 03/11/14.
 */

"use strict";

var express = require('express');

var filesInfo = require('./tennisDb');

console.log(JSON.stringify(filesInfo));
console.log(JSON.stringify(filesInfo.dbFileName));
console.log(JSON.stringify(filesInfo.getFilesInfo));

var app = express();

// cors stuff
app.all('/', function (req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function (req, res) {

  filesInfo.getFilesInfo(filesInfo.dbFileName, function (err, jsonFilesInfo) {

    console.log(jsonFilesInfo);

    res.send(jsonFilesInfo);
  });

//  res.send('hi');
});

app.listen(3000);

console.log('listening on 3000');