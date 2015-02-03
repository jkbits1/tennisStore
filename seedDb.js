/**
 * Created by jk on 23/01/15.
 */

var mongoose = require('mongoose');
var pathInfo = require('./pathInfo');

module.exports = {
  createDbSeedsFromFile: createDbSeedsFromFile,
  mainDbName: "mongodb://localhost/proginfo",
  testDbName: "mongodb://localhost/proginfoTest"
};

var modelName = 'prog';

function createDbSeedsFromFile(dbName) {

  var db =
    mongoose.connect(dbName);

  var progItem = new mongoose.Schema({
    //progId:
    id: 'number',
    path: 'string', name: 'string'
  });

  var ProgModel = mongoose.model(modelName, progItem);

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

    prog.save();
  }

  function end() {

    db.disconnect();
  }

  pathInfo.queryInfoFile(processLine, end);
}
