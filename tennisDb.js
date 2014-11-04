/**
 * Created by jk on 03/11/14.
 */

"use strict";

var level = require('level');

var dbFile = '\\Users\\Jon\\Documents\\GitHub\\tennisStore\\info.db';

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

module.exports = {

  testFn: function () {

  },
  getFilesInfo: getFilesInfoFn,
  dbFileName: dbFile
};
