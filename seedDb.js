/**
 * Created by jk on 23/01/15.
 */

var mongoose = require('mongoose');
var pathInfo = require('./pathInfo');

(function seedDbFromFile() {

  // currently not using this var
  //var db =
  mongoose.connect("mongodb://localhost/proginfo");

  var progItem = new mongoose.Schema({
    //progId:
    id: 'number',
    path: 'string', name: 'string'
  });

  var ProgModel = mongoose.model('prog', progItem);

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

  pathInfo.queryInfoFile(processLine);
})();









