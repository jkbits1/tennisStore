/**
 * Created by jk on 21/11/14.
 */

var filesInfo = require('../tennisDb');

describe('tennisDb', function () {

  var jsonFilesInfoTest = undefined;

  beforeEach(function (done) {

    filesInfo.getFilesInfo(filesInfo.dbFileName, function (err, jsonFilesInfo) {

      if (err) {
        return console.error(err);
      }

      jsonFilesInfoTest = jsonFilesInfo;

      done();
    });

  });

//  afterEach(function () {
//  });

  it('should get file entries', function () {

    expect(jsonFilesInfoTest.fileEntries.length).toEqual(3);

    console.log(jsonFilesInfoTest);
    console.log("len:", jsonFilesInfoTest.fileEntries.length);

//      res.send(jsonFilesInfo);
  });

  it('should get file entries with correct fields', function () {

    expect(jsonFilesInfoTest.fileEntries[0].id).toBeDefined();
    expect(jsonFilesInfoTest.fileEntries[0].item).toBeDefined();
    expect(jsonFilesInfoTest.fileEntries[0].info).toBeDefined();
    expect(jsonFilesInfoTest.fileEntries[0].players).toBeDefined();
  });

  it('should get file entries with players as an array', function () {

    // NOTE: this is a very basic test
    expect(jsonFilesInfoTest.fileEntries[0].players.length).toBeDefined();
  });
});
