/**
 * Created by jk on 27/12/14.
 */

var express = require('express');
var getFolderList = require('./fileParse');

var app = express();

app.all('*', function (req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  next();
});

app.get('/', function (req, res) {

  getFolderList("H:\\Video\\SG3\\TVee\\SGATE AT", function(err, list) {

    res.send({
      files: list
    });
  });

});

var server = app.listen(3030, function() {});
