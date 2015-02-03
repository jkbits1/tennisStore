/**
 * Created by jk on 03/11/14.
 */

"use strict";

var level = require('level');
var through = require('through');

var dbFile = '\\Users\\Jon\\Documents\\GitHub\\tennisStore\\info.db';

module.exports = {
  testFn: function() {},
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
      cb(err);
      return console.error(err);
    }

    db.put('file1', 'tennis video', function (err) {

      if (err) {
        db.close();
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
      cb(err);
      return console.error(err);
    }

    function write(fileInfo) {
      var fileInfoAsString = fileInfo.value.toString();

      if (fileInfoAsString.indexOf("item") !== -1) {

//        console.error("get2 item:", JSON.parse(fileInfoAsString));
        jsonFilesInfo.fileEntries.push(JSON.parse(fileInfoAsString));
//        this.queue(fileInfoAsString);
      }
      else {
//        jsonFilesInfo.fileEntries.push(fileInfo);//
//        this.queue(JSON.stringify(fileInfo));
      }
    }

    function end() {
//      console.error("get2 db close");
      db.close();
      cb(null, jsonFilesInfo);
      this.queue(null);
    }

    var stream = db.createReadStream(
//      {valueEncoding: "json"}
    );

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
    stream.on('error', function (err) {
      if (err){
        db.close();
        cb(err);
      }
    });
//
//    stream.on('end', function () {
//
//      db.close();
//      cb(null, jsonFilesInfo);
//    });
//    });
  });
}

function putFilesInfoFn(dbFileName, filesInfo, cb){

  var jsonFilesInfo = {

    fileEntries: []
  };

  level(dbFileName, function (err, db) {

    if (err) {
      db.close();
      cb(err);
      return console.error(err);
    }

    filesInfo.notes.forEach(function (val, idx, arr) {
      console.error(val);

//      db.put('file1', 'tennis video', function (err) {
      db.put(filesInfo.folderName + "!" + val.id.toString(), val,
        {valueEncoding: 'json'}
        , function (err) {

        if (err) {
          db.close();
          cb(err);
        }

        var stream = db.createReadStream();

        stream.on('data', function (entry) {
          console.log(entry.key + ": " + entry.value);

          var entryAsString = entry.value.toString();
          if (entryAsString.indexOf("item") !== -1) {
            console.error(JSON.parse(entry.value));
          }

          jsonFilesInfo.fileEntries.push(entry);
        });

        stream.on('error', function (err) {
          if (err){
            db.close();
            cb(err);
          }
        });

        stream.on('end', function () {
          db.close();
//          cb(null, jsonFilesInfo);
          cb(null, "done");
        });
      });
    });
  });
}
