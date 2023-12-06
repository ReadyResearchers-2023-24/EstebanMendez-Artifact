const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
const async = require('async');
const crypto = require('crypto'); // Required for generating a session secret
require('dotenv').config(); // Load environment variables from a .env file

const routes = require('./routes/index');
const users = require('./routes/users');
const us = require('./routes/us');
const classes = require('./routes/classes');
const students = require('./routes/students');
const instructors = require('./routes/instructors');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// Middleware and configurations
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
const sessionSecret = crypto.randomBytes(64).toString('hex'); // Generate a session secret
app.use(session({
  secret: sessionSecret,
  saveUninitialized: true,
  resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    const namespace = param.split('.');
    const root = namespace.shift();
    let formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg,
      value
    };
  }
}));

// Connect-Flash
app.use(flash());

// Makes the user object global in all views
app.get('*', function (req, res, next) {
  // Put user into res.locals for easy access from templates
  res.locals.user = req.user || null;
  if (req.user) {
    res.locals.type = req.user.type;
  }
  next();
});

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// MongoDB Connection
mongoose.connect(`mongodb+srv://mendez01:${process.env.MONGO_PASSWORD}@cluster0.zsvww85.mongodb.net/elearn`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authMechanism: 'DEFAULT'
});

// Routes
app.use('/', routes);
app.use('/users', users);
app.use('/us', us);
app.use('/classes', classes);
app.use('/students', students);
app.use('/instructors', instructors);

// Error handling middleware
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
