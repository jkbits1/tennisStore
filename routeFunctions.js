/**
 * Created by jk on 13/01/16.
 */

var pathInfo = require('./pathInfo');

module.exports = {
  getFoldersFromFile: getFoldersFromFile
};

function getFoldersFromFile (req, res) {
  var pathList = [];

  function processLine (line) {
    var path = undefined;

    if (line === null || line === undefined || line.length === 0) {
      return;
    }
    path = pathInfo.getPathInfo(line);
    pathList.push(path);
  }

  function end() {
    res.send({
      paths: pathList
    });
  }

  pathInfo.queryInfoFile(processLine, end);
}


