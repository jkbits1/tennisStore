/**
 * Created by jk on 21/11/14.
 */

// ********
// NOTE:
// ********
//
// 1) debug jasmine as follows :
//C:\Users\Jon\Documents\GitHub\tennisStore>node-debug \Users\Jon\AppData\Roaming\npm\node_modules\jasmine\bin\jasmine.js
//
// 2) set this when running node-debug, to give async calls time to complete.
//jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000000.
// May need to set breakpoint on this line in jasmine.js (currently line 1782)
// if (queueableFn.timeout) {
//  timeoutId = Function.prototype.apply.apply(self.timer.setTimeout, [j$.getGlobal(), [function() {


var seedDb = require('../seedDb');

describe('seedDb', function () {

  var progDetails = undefined;

  beforeEach(function () {

  });

  afterEach(function () {
  //afterEach(function (done) {

    //progDetails.remove({}, function () {
    //
    //  console.error("test complete");
    //
    //  done();
    //});

  });

  it('should be able to initialise', function () {

    progDetails = seedDb.setUpDb(seedDb.testDbName);

    expect(progDetails).toBeDefined();
  });

  it('should populate stuff during initialisation', function (done) {

    function checkCreatedSeeds() {

      progDetails.find({}, function (err, docs) {

        expect(docs).toBeDefined();

        var currentFileId = 1;

        expect(docs.length).toEqual(2);

        docs.forEach(function (doc, index) {

          console.error("id, idx, i", doc._doc.id, index, currentFileId);

          expect(doc._doc.id).toEqual(currentFileId);

          currentFileId++;
        });

        done();
      });
    }

    seedDb.createDbSeedsFromFile(progDetails, false, checkCreatedSeeds);
  });
});
