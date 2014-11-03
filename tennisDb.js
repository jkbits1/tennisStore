/**
 * Created by jk on 03/11/14.
 */

"use strict";

var level = require('level');

level('\\Users\\Jon\\Documents\\GitHub\\tennisStore\\info.db', function (err, db) {

  if (err) {

    db.close();

    throw err;

    return console.error(err);
  }

  db.put('file1', 'tennis video', function (err) {

    if (err) {
      db.close();
      throw err;
    }

    var stream = db.createReadStream();

    stream.on('data', function (entry) {

      console.log(entry.key + ": " + entry.value);
    });

    stream.on('error', function (err) {

      if (err){
        db.close();

        throw err;
      }
    });

    stream.on('end', function () {

      db.close();
    });
  });
});



