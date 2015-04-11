/**
 * Created by jk on 23/01/15.
 */

(function () {

  var mongoose = require('mongoose');
  var pathInfo = require('./pathInfo');

  var folderCreator = require('./folderCreator');
  var folderCounter = require('./folderCounter');

  var mainDbName = undefined;
  var testDbName = undefined;
  var appPort = 3030;

  var db = undefined;

  if (process.env.NODE_ENV !== undefined) {
    console.error("NODE_ENV exists");

    if (process.env.NODE_ENV === "production") {
      console.error("NODE_ENV = production");

      //mainDbName = "mongodb://localhost/proginfo";

      if (process.env.MONGOLAB_URI === undefined) {
        console.error("no URI defined");
      }

      mainDbName = process.env.MONGOLAB_URI;
      testDbName = "mongodb://localhost/proginfoTest";

      appPort = process.env.PORT;
    }
    else if (process.env.NODE_ENV === "development") {
      console.error("NODE_ENV = development");

      mainDbName = "mongodb://localhost/proginfo";
      testDbName = "mongodb://localhost/proginfoTest";
    }
    else {
      console.error("NODE_ENV = other");

      mainDbName = "mongodb://localhost/proginfo";
      testDbName = "mongodb://localhost/proginfoTest";
    }
  }
  else {
    console.error("no NODE_ENV found");

    mainDbName = "mongodb://localhost/proginfo";
    testDbName = "mongodb://localhost/proginfoTest";
  }

  module.exports = {
    setUpDb: setUpDb,
    createDbSeedsFromFile: createDbSeedsFromFile,
    createTestFolders: createTestFolders,
    mainDbName: mainDbName,
    testDbName: testDbName,
    appPort: appPort
  };

  function setUpDb (dbName) {

    function createModel() {
      var modelName = 'prog';
      var schema = new mongoose.Schema({
        //progId:
        id: 'number', path: 'string', name: 'string', summary: 'string'
      });

      return mongoose.model(modelName, schema);
    }

    db = mongoose.connect(dbName);
    return createModel();
  }

  function createDbSeedsFromFile (ProgModel, closeDbAfterSeeding, cbCompleted) {
    var final_line_read = false;
    var seedsCreated = 0;
    var SEEDS_TO_CREATE = 2;

    function processLine (line) {
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

      var writeResult = prog.save(function (err, item, count) {
        if (err) {
          return console.error(err);
        }

        console.error("item, count", item, count);

        seedsCreated++;
        if (seedsCreated === SEEDS_TO_CREATE) {
          if (final_line_read === true) {
            closeDown();
          }
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

  function createTestFolders (){
    createTestFolder(0);
    createTestFolder(2);
  }

  function createTestFolder (suffix){
    var testFolderName = 'test';
    var suffixText = "";

    if (suffix !== 0) {
      suffixText = suffix.toString();
      testFolderName += suffixText;
    }

    folderCounter(testFolderName, function(err, count){
      if (err) {
        console.error(err);
        console.error("creating folder");

        folderCreator(testFolderName,
          "listFileName" + suffixText + ".txt"
          , function (err) {
            if (err) {
              console.error(err);
            }
        });
      }

      //console.error("count:", count);
    })
  }
})();
