/* eslint-disable camelcase */

const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const fs = require('fs')
const path = require('path')

// Include User Model
const User = require('../models/user')
// Include Student Model
const Student = require('../models/student')
// Include Instructor Model
const Instructor = require('../models/instructor')

// Middleware to check if the user is logged in
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

// User Register
router.get('/register', function (req, res, next) {
  res.render('users/register')
})

// Register User
router.post('/register', function (req, res, next) {
  // Get Form Values
  const first_name = req.body.first_name
  const last_name = req.body.last_name
  const street_address = req.body.street_address
  const city = req.body.city
  const state = req.body.state
  const zip = req.body.zip
  const email = req.body.email
  const username = req.body.username
  const password = req.body.password
  const password2 = req.body.password2
  const type = req.body.type

  // Form Validation
  req.checkBody('first_name', 'First name field is required').notEmpty()
  req.checkBody('last_name', 'Last name field is required').notEmpty()
  req.checkBody('email', 'Email field is required').notEmpty()
  req.checkBody('email', 'Email must be a valid email address').isEmail()
  req.checkBody('username', 'Username field is required').notEmpty()
  req.checkBody('password', 'Password field is required').notEmpty()
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password)

  const errors = req.validationErrors()

  if (errors) {
    res.render('users/register', {
      errors
    })
  } else {
    const newUser = new User({
      email,
      username,
      password,
      type
    })

    if (type == 'student') {
      console.log('Registering Student...')
      console.log(username, 'Registered as Student')

      const newStudent = new Student({
        first_name,
        last_name,
        address: [{
          street_address,
          city,
          state,
          zip
        }],
        email,
        username
      })

      User.saveStudent(newUser, newStudent, function (err, user) {
        console.log('Student created')
      })
    } else {
      console.log('Registering Instructor...')
      console.log(username, 'Registered as Instructor')

      const newInstructor = new Instructor({
        first_name,
        last_name,
        address: [{
          street_address,
          city,
          state,
          zip
        }],
        email,
        username
      })

      User.saveInstructor(newUser, newInstructor, function (err, user) {
        console.log('Instructor created')
      })
    }

    req.flash('success_msg', 'User Added')
    res.redirect('/')
  }
})

passport.serializeUser(function (user, done) {
  done(null, user._id)
})

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user)
  })
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }), function (req, res, next) {
  req.flash('success_msg', 'You are now logged in')
  const usertype = req.user.type
  console.log(req.user.username, 'Logged In')
  res.redirect('/' + usertype + 's/classes')
})

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
      if (err) throw err
      if (!user) {
        return done(null, false, { message: 'Unknown user ' + username })
      }

      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) return done(err)
        if (isMatch) {
          console.log(username, 'Provided correct password')
          return done(null, user)
        } else {
          console.log('Invalid Password')
          // Success Message
          console.log(username, 'Provided incorrect password')
          return done(null, false, { message: 'Invalid password' })
        }
      })
    })
  }
))

// Log User Out
router.get('/logout', isLoggedIn, function (req, res) {
  const username = req.user.username
  console.log(username, 'Logged Out')
  req.logout()
  // Success Message
  req.flash('success_msg', 'You have logged out')
  res.redirect('/')
})

// Get Classes Page
router.get('/students/classes', isLoggedIn, function (req, res, next) {
  console.log(req.user.username, 'Accessed Classes Page')
  Student.getStudentByUsername(req.user.username, function (err, student) {
    if (err) throw err
    res.render('students/classes', { student })
  })
})

// Register Student for Class
router.post('/students/classes/register', isLoggedIn, function (req, res) {
  const student_username = req.user.username
  const class_id = req.body.class_id
  const class_title = req.body.class_title

  console.log(student_username, `Registered for Class: ${class_title}`)

  // Check if the student is already registered for the class
  Student.getStudentByUsername(student_username, function (err, student) {
    if (err) {
      throw err
    }

    if (!student) {
      // Handle the case where the student is not found (you can display an error message)
      req.flash('error_msg', 'Student not found.')
      res.redirect('/students/classes')
    } else {
      // Check if the class with the same class_id already exists in the student's classes
      const existingClass = student.classes.find(cls => cls.class_id.toString() === class_id.toString())

      if (existingClass) {
        // Display a message indicating that the student is already registered for the class
        req.flash('error_msg', 'You are already registered for this class.')
        res.redirect('/students/classes')
      } else {
        // Add the new class to the student's classes
        student.classes.push({ class_id, class_title })
        student.save(function (err) {
          if (err) {
            throw err
          }
          req.flash('success_msg', 'You are now registered.')
          res.redirect('/students/classes')
        })
      }
    }
  })
})

// Example of a protected route
router.get('/protected', isLoggedIn, function (req, res) {
  console.log(req.user.username, 'Accessed Protected Route')
  res.send('You have accessed the protected route.')
})

module.exports = router
