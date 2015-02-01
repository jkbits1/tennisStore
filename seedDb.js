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
      //path: "G:\\Stuff\\Video\\TV\\UTOP",
      //name: "Utopia"

      id: path.id,
      path: path.path,
      name: path.name
    });

    prog.save();

    //pathList.push(path);
  }

  //function end() {
  //
  //  //if (err) {
  //  //
  //  //  res.send(err);
  //  //}
  //
  //  res.send({
  //    paths: pathList
  //  });
  //}

  pathInfo.queryInfoFile(processLine); //, end


  //var prog = new ProgModel({
  //
  //  //progId:
  //  //id: 1,
  //  //path: "G:\\Stuff\\Video\\TV\\UTOP",
  //  //name: "Utopia"
  //});
  //
  //prog.save();
  //
  //prog = new ProgModel({
  //
  //  //progId:
  //  id: 2,
  //  path: "H:\\Video\\SG3\\TVee\\SGATE AT",
  //  name: "Stargate Atlantis"
  //});
  //
  //prog.save();
})();









