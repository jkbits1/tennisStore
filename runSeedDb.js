/**
 * Created by jk on 03/02/15.
 */

var seedDb = require("./seedDb");

(function () {

  seedDb.createDbSeedsFromFile(seedDb.setUpDb(seedDb.mainDbName), true, function() {

    console.error("db seeded");
  });
})();



