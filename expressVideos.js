/**
 * Created by jk on 27/12/14.
 */

//  using IIFE to clarify functions declared are not used
//  elsewhere. This may well be an unnecessary addition.
(function(){
  var bunyan = require('bunyan');
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
  var seedDb = require('./seedDb');

  var folderCreator = require('./folderCreator');
  var folderCounter = require('./folderCounter');

  var routeFns = require('./routeFunctions');

  console.error("dir:", __dirname);

  var app = express();
  // connect to db
  var progDetails = seedDb.setUpDb(seedDb.mainDbName);
  var getDbEpisodeDetails = seedDb.getDbEpisodeDetails(seedDb.mainDbName);

  var log = bunyan.createLogger({
    name: 'expressVideos',
    serializers: {
      req: bunyan.stdSerializers.req,
      res: bunyan.stdSerializers.res
    }
  });

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

  //function getMongoData (res, callback) {
  //  progDetails.find({}, callback);
  //}

  function ensureProgIdIsValidOrDefault (progId){

    if (isNaN(progId) || progId === undefined) {
      console.log("invalid progId, using default value");

      progId = seedDb.defaultEpisodeId;
    }

    return progId;
  }

  function getProgrammeDetails (req, res){
    var progId = ensureProgIdIsValidOrDefault(+(req.params.progId));

    var progName = "";
    var progSummary = "";

    console.log("getProgrammeDetails:", progId);

    progDetails.find({id: progId}, function (err, docs) {
      if (err) {
        console.error("getProgrammeDetails - find error:", err);
        //res.redirect('/');
        res.send({info: "details not found"});
      }

      res.send(docs);
    });

    //res.send({programmeName: progName, programmeSummary: progSummary});
  }

  function getEpisodesInfo (req, res) {
    var progId = ensureProgIdIsValidOrDefault(+(req.params.progId));
    var lineCount = 0;
    var progInfoFound = false;

    console.log("getEpisodesInfo: ", progId);

    function processPathInfo (pathInfo) {
      lineCount++;
      if (pathInfo._doc.id === progId){
        progInfoFound = true;
        getFolderList(pathInfo._doc.path, function (err, list) {
          if (err) {
            console.log("getEpisodesInfo: no files found", err);

            //res.redirect('/');
            res.send({
              //files: []
            });

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
        console.error("getEpisodesInfo: db error -", err);

        //return res.redirect('/');
        res.send({
          //files: []
        });
      }
      docs.forEach(processPathInfo);
      // no valid info found, redirect
      if (progInfoFound === false) {
        console.error("getEpisodesInfo: no episodes found");

        //res.redirect('/');
        res.send({
          //files: []
        });
      }
    });
  }

  function getEpisodeDetails (req, res) {
    var episodeId = +(req.params.episodeId);

    getDbEpisodeDetails.find(
      {progId: episodeId}
      //{}
      , function (err, docs) {
      if (err) {
        console.error("getEpisodeDetails - find error:", err);
        //res.redirect('/');
        res.send({info: "details not found"});
      }

      res.send(docs);
    });


  }

  function redirectToAppHome (req, res) {
    console.log("redirect to app home");

    res.redirect('/app');
  }

  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
  }

  function forceSSL (req, res, next){
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }

    return next();
  }

  if (process.env.NODE_ENV === 'production') {
    app.use(forceSSL);
  }

  //app.use(express.favicon());
  app.use(favicon(__dirname + '/images/favicon.ico'));



  app.use(morgan('dev'));
  //app.use(morgan('combined'));
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
  //app.get('/', getDefaultEpisodesInfo);
  app.get('/', redirectToAppHome);

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
      if (err) {
        console.error("manageFolders", err);
        res.redirect('/');
      }

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
    var summary = req.body.summary;

    console.error("id:", id);
    console.error("name:", name);
    console.error("path:", path);
    console.error("summary:", summary);

    //progDetails.insert({id: id, name: name, path: path}, function(err, result){
    progDetails.create({id: id, name: name, path: path, summary: summary}, function(err, result){
      if (err) {
        console.error("couldn't add path");
      }
      res.redirect('/manageFolders');
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    //successRedirect: '/profile',
    successRedirect: '/app',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  //app.post('/signupClient', passport.authenticate('local-signup'), function (req, res){
  //  res.send("123");
  //});
  app.post('/signupClient', function (req, res, next){
    passport.authenticate('local-signup', function (err, user, info, test) {

      if (err) {
        console.error("failed signup");

        return next(err);
      }

      if (!user) {
        console.error("user exists already");

        return res.send(401, "Bad signup info");
      }

      req.logIn(user, function (err) {
        if (err) {
          console.error("failed login after signup", err);

          return next(err);
        }

        return res.send(user._doc.local.email);
      });
    })(req, res, next);
  } );

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
            console.error("failed login 2", err);

            return next(err);
          }

          //return res.redirect('/manageFolders');
          //return res.send({ loggedIn: 'test123' });
          //return res.send(user);
          return res.send(user._doc.local.email);
        });
      })(req, res, next);
  });


  app.get('/folders', routeFns.getFoldersFromFile);
  app.get('/foldersDb', routeFns.getFoldersFromDb);

  //app.get('/:progId', getEpisodesInfo);
  //app.get('/:progId([0-9]+)', getEpisodesInfo);

  //app.get('/episodesInfo/:progId([0-9]+)', getEpisodesInfo);
  // make param optional
  app.get('/episodesInfo/:progId([0-9]+)?', getEpisodesInfo);

  app.get('/episodeDetails/:episodeId([0-9]+)?', getEpisodeDetails);


  //NOTE: this route needs to be placed before
  //      /:progId route. Reasons not fully
  //      understood yet.
  //app.get('/chooseProgramme/', function (req, res) {

  //NOTE: think this is always handled by app.use('/'...
  //app.get('/app/', redirectToAppHome);

  // fails
  //app.get('/progDetails/:progId([0-9]*)', getProgrammeDetails);

  // optional param value
  //app.get('/progDetails/:progId?', getProgrammeDetails);
  // optional numeric param values only
  app.get('/progDetails/:progId([0-9]+)?', getProgrammeDetails);


  //NOTE: temporary handling of keep-alive request
  //app.get('/favicon.ico', function (req, res) {
  //  res.send({});
  //});

  var server = app.listen(seedDb.appPort, function() {
    console.error("started server on port:", seedDb.appPort);
  });
})();
