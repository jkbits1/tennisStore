/**
 * Created by jk on 27/12/14.
 */

//  using IIFE to clarify functions declared are not used
//  elsewhere. This may well be an unnecessary addition.
(function(){
  var express = require('express');
  var favicon = require('serve-favicon');
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

  //var templatePath = require.resolve('./template.jade');
  var templatePath = require.resolve('./views/manageFolders.jade');
  var templateFn = require('jade').compileFile(templatePath);

  var getFolderList = require('./fileParse');
  var pathInfo = require('./pathInfo');
  var seedDb = require('./seedDb');

  var folderCreator = require('./folderCreator');
  var folderCounter = require('./folderCounter');

  console.error("dir:", __dirname);

  var app = express();
  // connect to db
  var progDetails = seedDb.setUpDb(seedDb.mainDbName);

  seedDb.createTestFolders();

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

  //function getMongoData (res, callback) {
  //  progDetails.find({}, callback);
  //}

  function getFoldersFromDb (req, res) {

    console.error("folders db requested");

    progDetails.find({}, function(err, docs){

      console.error('folders db - db responded');

      if (err) {
        return res.send(401, "folders not found");
      }

      console.error("folders db - sending");

      res.send(docs);
      //res.send({
      //
      //  paths: docs
      //});
    });
  }

  // as a default, currently get the first line from the file and use that.
  //NOTE: revised to default to db access
  function getDefaultEpisodesInfo (req, res) {
    var lineCount = 0;
    var progInfoFound = false;

    console.error('getDefaultEpisodesInfo - starting');

    //function processLine(line) {
    function processPathInfo(pathInfo) {
      //var path = pathInfo.getPathInfo(line);
      console.error('getDefaultEpisodesInfo - handling path info');

      lineCount++;
      if (lineCount === 1) {
        progInfoFound = true;
        getFolderList(pathInfo._doc.path, function (err, list) {
          res.send({
            files: list
          });
        });
      }
    }

    //pathInfo.queryInfoFile(processLine);
    progDetails.find({}, function (err, docs) {

      console.error('getDefaultEpisodesInfo - db responded');

      //NOTE: possibly may create endless loop here
      if (err) {
        console.error('getDefaultEpisodesInfo - error');
        return res.redirect('/');
      }

      docs.forEach(processPathInfo);

      // no valid info found, redirect
      if (progInfoFound === false) {
        console.error('getDefaultEpisodesInfo - no data, sending empty object');

        //NOTE: possibly may create endless loop here
        //res.redirect('/');
        res.send({});
      }
    });
  }

  function getEpisodesInfo (req, res) {
    var lineCount = 0;
    var progId = +(req.params.progId);
    var progInfoFound = false;

    function processPathInfo (pathInfo) {
      lineCount++;
      if (pathInfo._doc.id === progId){
        progInfoFound = true;
        getFolderList(pathInfo._doc.path, function (err, list) {
          if (err) {
            console.log("no episodes found", err);
            res.redirect('/');

            return;
          }
          res.send({
            files: list
          });
        });
      }
    }

    progDetails.find({}, function (err, docs) {
      if (err) {
        return res.redirect('/');
      }
      docs.forEach(processPathInfo);
      // no valid info found, redirect
      if (progInfoFound === false) {
        res.redirect('/');
      }
    });
  }

  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
  }

  //app.use(express.favicon());
  app.use(favicon(__dirname + '/images/favicon.ico'));

  //app.use(morgan('dev'));
  app.use(morgan('combined'));
  app.use(cookieParser());

  // change to use specific, non-deprecated, options
  //app.use(bodyParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.set('view engine', 'ejs');

  // NOTE: may decide to use multiple
  //       view engines sometime.
  //app.set('view engine', jade);

  //NOTE: added resave option to resolve deprecated warning.
  //      Need to check that false is valid for all scenarios
  //NOTE: added saveUninitialized, with same caveat as for resave
  app.use(session(
    {
      secret: 'video manager',
      resave: false,
      saveUninitialized: false
    }));
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
    res.header("Access-Control-Allow-Headers", "Origin, x-Requested-With, Content-Type, Accept");
    next();
  });
  app.get('/', getDefaultEpisodesInfo);

  app.get('/account', function (req, res) {
    res.render('account.ejs');
  });
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage')   })
  });
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash ('signupMessage') });
  });
  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs', {
      user: req.user
    });
  });
  app.get('/isLoggedIn', isLoggedIn, function (req, res) {
    res.send({loggedIn: true});
  });
  app.get('/manageFolders', isLoggedIn, function (req, res) {

    progDetails.find({}, function (err, docs) {
      //res.send(docs);
      res.write(templateFn({ user: req.user,
        //folders: [{name: 'one', value: 1}, {name: 'two', value: 2}]
        folders: docs
      }));
      res.end();
    });
  });
  app.get('/createTestFolder/:folderName/:listName', isLoggedIn, function (req, res) {
    folderCreator(req.params.folderName,
      //"listFileName.txt"
      req.params.listName
      , function (err){
      if (err) {
        console.error(err);
        return res.send(401);
      }

      res.send({ createdFolder: true });
    });
  });
  app.get('/testFolderCount/:suffix', function (req, res) {
    var testFolderName = 'test';

    if (req.params.suffix !== '0' ) {
      testFolderName += req.params.suffix;
    }
    folderCounter(testFolderName, function(err, count){
      if (err) {
        console.error(err);
        return res.send(401);
      }

      res.send({ folderCount: count });
    })
  });

  app.post('/addPath', isLoggedIn, function (req, res) {

    var id = +(req.body.id);
    var path = req.body.path;
    var name = req.body.name;

    console.error("id:", id);
    console.error("name:", name);
    console.error("path:", path);

    //progDetails.insert({id: id, name: name, path: path}, function(err, result){
    progDetails.create({id: id, name: name, path: path}, function(err, result){
      if (err) {
        console.error("couldn't add path");
      }
      res.redirect('/manageFolders');
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

  //app.post('/loginClient', passport.authenticate('local-login', function (req, res){
  // code from passport custom callback - using for debugging purposes
  app.post('/loginClient', function (req, res, next) {
      passport.authenticate('local-login', function (err, user, info) {
        if (err) {
          console.error("failed login");

          return next(err);
        }
        if (!user) {
          console.error("failed pwd");

          //return res.redirect('/login');
          return res.send(401, "Bad login info");
        }

        req.logIn(user, function (err) {
          if (err) {
            console.error("failed login 2");
            return next(err);
          }

          //return res.redirect('/manageFolders');
          //return res.send({ loggedIn: 'test123' });
          //return res.send(user);
          return res.send(user._doc.local.email);
        });
      })(req, res, next);
  });


  app.get('/folders', getFoldersFromFile);
  app.get('/foldersDb', getFoldersFromDb);

  //NOTE: this route needs to be placed before
  //      /:progId route. Reasons not fully
  //      understood yet.
  //app.get('/chooseProgramme/', function (req, res) {
  app.get('/app/', function (req, res) {
    res.sendfile('/public/index.html');
  });

  app.get('/:progId', getEpisodesInfo);

  //NOTE: temporary handling of keep-alive request
  app.get('/favicon.ico', function (req, res) {
    res.send({});
  });

  var server = app.listen(seedDb.appPort, function() {
    console.error("started server");
  });
})();
