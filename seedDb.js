/**
 * Created by jk on 23/01/15.
 */

var mongoose = require('mongoose');
var pathInfo = require('./pathInfo');

module.exports = {
  setUpDb: setUpDb,
  createDbSeedsFromFile: createDbSeedsFromFile,
  mainDbName: "mongodb://localhost/proginfo",
  testDbName: "mongodb://localhost/proginfoTest",
  appPort: 3030
};

var db = undefined;
var modelName = 'prog';

var seedsCreated = 0;
var SEEDS_TO_CREATE = 2;

var final_line_read = false;

function setUpDb(dbName) {

  // currently not using this var
  db = mongoose.connect(dbName);

  return createModel();
}

function createModel() {

  var sch = new mongoose.Schema({
    //progId:
    id:
      'number',
    path: 'string', name: 'string'
  });

  return mongoose.model(modelName, sch);
}

function createDbSeedsFromFile(ProgModel, closeDbAfterSeeding, cbCompleted) {

  function processLine(line) {

    if (line === null || line === undefined || line.length === 0) {

      return;
    }

    var path = pathInfo.getPathInfo(line);

    var prog = new ProgModel({

      //progId:
      //id: 1,

      id: path.id,
      path: path.path,
      name: path.name
    });

    var writeResult = prog.save(function(err, item, count) {

      if (err) {

        return console.error(err);
      }

      console.error("item, count", item, count);

      seedsCreated++;

      if (seedsCreated === SEEDS_TO_CREATE) {

        if (final_line_read === true) {

          closeDown();
        }

        //if (closeDbAfterSeeding !== undefined && closeDbAfterSeeding === true) {
        //
        //  db.disconnect();
        //}
        //
        //if (cbCompleted !== undefined && cbCompleted !== null) {
        //
        //  cbCompleted();
        //}
      }
    });
  }

  function end() {

    final_line_read = true;

    if (seedsCreated == SEEDS_TO_CREATE) {

      //process.nextTick(closeDown);
      //}
      closeDown();
    }
  }

  function closeDown() {

    //if (seedsCreated < SEEDS_TO_CREATE) {
    //
    //  process.nextTick(closeDown);
    //
    //  return;
    //}

    if (closeDbAfterSeeding !== undefined && closeDbAfterSeeding === true) {

      db.disconnect();
    }

    if (cbCompleted !== undefined && cbCompleted !== null) {

      cbCompleted();
    }
  }

  pathInfo.queryInfoFile(processLine, end);
}
