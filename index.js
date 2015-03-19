var express = require('express');
var cool = require('cool-ascii-faces');
var pg = require('pg');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/db', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function (err, client, done) {
    client.query('SELECT * FROM test_table', function (err, result) {
      done();
      if (err) {
        console.error(err);
        res.send("Error " + err);
      } else {
        res.send(result.rows);
      }
    });
  });
});

app.get('/', function(request, response) {
  var result = '';
  var times = process.env.TIMES || 5;

  for (i=0; i<times; i++) {
    result += cool();
  }
  //response.send('Hello World!');
  //response.send(cool());
  response.send(result);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
