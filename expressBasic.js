/**
 * Created by jk on 03/11/14.
 */

"use strict";

var express = require('express');
var cors = require('cors');

var filesInfo = require('./tennisDb');

console.log(JSON.stringify(filesInfo));
console.log(JSON.stringify(filesInfo.dbFileName));
console.log(JSON.stringify(filesInfo.getFilesInfo));

var app = express();

// NOTE: currently not using this middleware due to
// app.all() fix below. However, it may come in useful.
//app.use(cors());

// cors stuff
// NOTE: as POST request comes to path '/note', these
//       headers were not being sent before  changed
//       '/' to '*'
//app.all('/', function (req, res, next) {
app.all('*', function (req, res, next) {

  // trying to reverse-engineer cors fix.
  // There's more of this before next(), below.
  if (req.method === 'OPTIONS') {

    console.error('OPTIONS method');
  }

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  res.header("Access-Control-Allow-Credentials", true);

  if (req.method === 'OPTIONS') {
    // cribbed from cors() middleware - see above.
    res.statusCode = 204;
    res.end();

    console.error('OPTIONS method');
  }
  else {
    next();
  }
});

app.get('/', function (req, res) {

  filesInfo.getFilesInfo(filesInfo.dbFileName, function (err, jsonFilesInfo) {

    if (err) {
      return console.error(err);
    }

//    console.log(jsonFilesInfo);
    res.send(jsonFilesInfo);
  });

//  res.send('hi');
//  res.end();
});

app.post('/note', function (req, res) {

  req.pipe(process.stderr);

  req.on('data', function (data) {

    filesInfo.putFilesInfo(filesInfo.dbFileName,
      JSON.parse(data.toString()),
      function (err, message) {

        if (err) {
          return console.error(err);
        }

        console.log(message);
//        res.send(jsonFilesInfo);
      }
    );
  });

  req.on('error', function (err) {

    return console.error(err);
  });

  req.on('end', function() {});

  console.log("note from client");
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  res.send("got a note");
});

app.listen(3000);

console.log('listening on 3000');