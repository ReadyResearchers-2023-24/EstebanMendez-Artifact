const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local'); let Strategy
const mongo = require('mongodb')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/elearn')
const db = mongoose.connection
async = require('async')

const routes = require('./routes/index')
const users = require('./routes/users')
const us = require('./routes/us')
const classes = require('./routes/classes')
const students = require('./routes/students')
const instructors = require('./routes/instructors')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }))
app.set('view engine', 'handlebars')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    const namespace = param.split('.')
    const root = namespace.shift()
    let formParam = root

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg,
      value
    }
  }
}))

// Connect-Flash
app.use(flash())

// Makes the user object global in all views
app.get('*', function (req, res, next) {
  // put user into res.locals for easy access from templates
  res.locals.user = req.user || null
  if (req.user) {
    res.locals.type = req.user.type
  }
  next()
})

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use('/', routes)
app.use('/users', users)
app.use('/us', us)
app.use('/classes', classes)
app.use('/students', students)
app.use('/instructors', instructors)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
