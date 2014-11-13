/**
 * Created by jk on 03/11/14.
 */

"use strict";

var level = require('level');
var through = require('through');

var dbFile = '\\Users\\Jon\\Documents\\GitHub\\tennisStore\\info.db';

module.exports = {

  testFn: function () {

  },
  getFilesInfo: getFilesInfoFn2,
  putFilesInfo: putFilesInfoFn,
  dbFileName: dbFile
};

function getFilesInfoFn(dbFileName, cb){

  var jsonFilesInfo = {

    fileEntries: []
  };

  level(dbFileName, function (err, db) {

    if (err) {

      db.close();

//      throw err;
      cb(err);

      return console.error(err);
    }

    db.put('file1', 'tennis video', function (err) {

      if (err) {
        db.close();

//        throw err;
        cb(err);
      }

      var stream = db.createReadStream();

      stream.on('data', function (entry) {

        console.log(entry.key + ": " + entry.value);

        jsonFilesInfo.fileEntries.push(entry);
      });

      stream.on('error', function (err) {

        if (err){
          db.close();

//          throw err;
          cb(err);
        }
      });

      stream.on('end', function () {

        db.close();

        cb(null, jsonFilesInfo);
      });
    });
  });
}

function getFilesInfoFn2(dbFileName, cb){

//  var tr = through();

  var jsonFilesInfo = {

    fileEntries: []
  };

  level(dbFileName, function (err, db) {

    if (err) {
      db.close();

//      throw err;
      cb(err);
      return console.error(err);
    }

    function write(fileInfo) {

      jsonFilesInfo.fileEntries.push(fileInfo);

      this.queue(JSON.stringify(fileInfo));
    }

    function end() {

      console.error("db close");
      db.close();
      cb(null, jsonFilesInfo);

      this.queue(null);
    }

    var stream = db.createReadStream();

    // NOTE: trying a pipe into a through stream
    //       Is this more elegant, or more in the
    //       Node style ?
    stream.pipe(through(write, end)).pipe(process.stderr);

//    stream.on('data', function (entry) {
//
//      console.log(entry.key + ": " + entry.value);
//      jsonFilesInfo.fileEntries.push(entry);
//    });
//
//    stream.on('error', function (err) {
//      if (err){
//        db.close();
//
////          throw err;
//        cb(err);
//      }
//    });
//
//    stream.on('end', function () {
//
//      db.close();
//      cb(null, jsonFilesInfo);
//    });
//    });
  });
}

function putFilesInfoFn(dbFileName, cb){

  var jsonFilesInfo = {

    fileEntries: []
  };

  level(dbFileName, function (err, db) {

    if (err) {
      db.close();

//      throw err;
      cb(err);
      return console.error(err);
    }

    db.put('file1', 'tennis video', function (err) {

      if (err) {
        db.close();

//        throw err;
        cb(err);
      }

      var stream = db.createReadStream();

      stream.on('data', function (entry) {

        console.log(entry.key + ": " + entry.value);

        jsonFilesInfo.fileEntries.push(entry);
      });

      stream.on('error', function (err) {

        if (err){
          db.close();

//          throw err;
          cb(err);
        }
      });

      stream.on('end', function () {

        db.close();

        cb(null, jsonFilesInfo);
      });
    });
  });
}

