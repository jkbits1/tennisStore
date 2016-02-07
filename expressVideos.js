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

  var getFolderList = require('./fileParse');
  var seedDb = require('./seedDb');

  var folderCreator = require('./folderCreator');
  var folderCounter = require('./folderCounter');

  var routeFns = require('./routeFunctions');

  console.error("dir:", __dirname);

  var app = express();
  var dbProgDetails = seedDb.setUpDb(seedDb.mainDbName);
  var dbEpisodeDetails = seedDb.getDbEpisodeDetails(seedDb.mainDbName);

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

  app.use(favicon(__dirname + '/images/favicon.ico'));

  app.use(morgan('dev'));   //app.use(morgan('combined'));
  app.use(cookieParser());

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.set('view engine', 'ejs');
  // NOTE: may decide to use multiple view engines sometime.
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

  // enables urls in this format :
  //  http://localhost:3030/app/#/chooseProgramme
  app.use('/app', express.static(__dirname + '/public'));

  app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, x-Requested-With, Content-Type, Accept");
    next();
  });
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

  app.get('/manageFolders', isLoggedIn, routeFns.manageFolders);

  app.get('/createTestFolder/:folderName/:listName', isLoggedIn, function (req, res) {
    folderCreator(req.params.folderName,
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

  app.post('/addPath', isLoggedIn, routeFns.addPath);
  app.post('/episodeDetails/add', isLoggedIn, function (req, res) {

    var progId = +(req.body.progId);
    var date = req.body.date;
    var time = req.body.time;
    var viewed = req.body.viewed;

    console.error("progId:", progId);
    console.error("date:", date);
    console.error("time:", time);
    console.error("viewed:", viewed);

    dbEpisodeDetails.create({progId: progId, date: date, time: time, viewed: viewed}, function(err, result){
      if (err) {
        console.error("couldn't add episodeDetails");
      }
      res.redirect('/episodeDetails');
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/app',
    failureRedirect: '/signup',
    failureFlash: true
  }));

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
    failureFlash: true
  }));

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

          return res.send(user._doc.local.email);
        });
      })(req, res, next);
  });

  app.get('/folders', routeFns.getFoldersFromFile);
  app.get('/foldersDb', routeFns.getFoldersFromDb);

  // param is optional
  app.get('/episodesInfo/:progId([0-9]+)?', routeFns.getEpisodesInfo);
  app.get('/episodeDetails/:episodeId([0-9]+)?', routeFns.getEpisodeDetails);

  // optional numeric param values only
  app.get('/progDetails/:progId([0-9]+)?', routeFns.getProgrammeDetails);

  var server = app.listen(seedDb.appPort, function() {
    console.error("started server on port:", seedDb.appPort);
  });
})();
