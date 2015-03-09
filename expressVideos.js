/**
 * Created by jk on 27/12/14.
 */

//  using IIFE to clarify functions declared are not used
//  elsewhere. This may well be an unnecessary addition.
(function(){
  var express = require('express');
  var fs = require('fs');
  var split = require('split');
  var mongoose = require('mongoose');
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var flash = require('connect-flash');

  var morgan = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var session = require('express-session');

  var getFolderList = require('./fileParse');
  var pathInfo = require('./pathInfo');
  var seedDb = require('./seedDb');

  var app = express();
  // connect to db
  var progDetails = seedDb.setUpDb(seedDb.mainDbName);

  function findUser (username, fn) {
    fn(null, user)
  }

  require('./config/passport')(passport);

  passport.use(new LocalStrategy( function (user, pwd, done) {
    process.nextTick( function (err, user) {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  }));

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
      //if (err) {
      //
      //  res.send(err);
      //}
      res.send({
        paths: pathList
      });
    }

    pathInfo.queryInfoFile(processLine, end);
  }

  function getFoldersFromDb (req, res) {

    function getMongoData (res) {
      progDetails.find({}, function (err, docs) {
        res.send(docs);
        //res.send({
        //
        //  paths: docs
        //});
      });
    }

    getMongoData(res);
  }

  // as a default, currently get the first line from the file and use that.
  function getDefaultEpisodesInfo (req, res) {
    var lineCount = 0;

    function processLine (line) {
      var path = pathInfo.getPathInfo(line);

      lineCount++;
      if (lineCount === 1) {
        getFolderList(path.path, function (err, list) {
          res.send({
            files: list
          });
        });
      }
    }

    pathInfo.queryInfoFile(processLine);
  }

  function getEpisodesInfo (req, res) {
    var lineCount = 0;
    var progId = +(req.params.progId);

    function processLine (line) {
      var path = pathInfo.getPathInfo(line);

      lineCount++;
      if (path.id === progId){
        getFolderList(path.path, function (err, list) {
          res.send({
            files: list
          });
        });
      }
    }

    pathInfo.queryInfoFile(processLine);
  }

  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
  }

  //app.use(morgan('dev'));
  app.use(morgan('combined'));
  app.use(cookieParser());
  app.use(bodyParser());

  app.set('view engine', 'ejs');

  app.use(session({secret: 'video manager'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // works for these urls, when view1 folder directly beneath root
  //http://localhost:3030/view1/view1.html
  //http://localhost:3030/chooseProgramme
  //app.use('/view1', express.static(__dirname + '/view1'));

  // works for these urls, when viewX folder beneath public
  //http://localhost:3030/view1/view1.html
  //http://localhost:3030/chooseProgramme
  //app.use('/view1', express.static(__dirname + '/public/view1'));
  //app.use('/view2', express.static(__dirname + '/public/view2'));

  //app.use('/view1', express.static('/public/view1'));

  // works for :
  //http://localhost:3030/public/app.css
  //http://localhost:3030/public/view1/view1.html
  //app.use('/public', express.static(__dirname + '/public'));

  //app.use('/', express.static(__dirname + '/public'));

  // enables urls in this format :
  //  http://localhost:3030/app/#/chooseProgramme
  app.use('/app', express.static(__dirname + '/public'));

  app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });
  app.get('/', getDefaultEpisodesInfo);

  app.get('/account', function (req, res) {
    res.render('account.ejs');
  });
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage')   })
  });
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash ('signupMessage') });
  });
  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs', {
      user: req.user
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    //failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/folders', getFoldersFromFile);
  app.get('/foldersDb', getFoldersFromDb);

  //NOTE: this route needs to be placed before
  //      /:progId route. Reasons not fully
  //      understood yet.
  //app.get('/chooseProgramme/', function (req, res) {
  app.get('/app/', function (req, res) {
    res.sendfile('./public/index.html');
  });

  app.get('/:progId', getEpisodesInfo);

  var server = app.listen(seedDb.appPort, function() {});
})();
