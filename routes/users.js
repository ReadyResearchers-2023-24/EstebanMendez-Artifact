const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// Include User Model
const User = require('../models/user')
// Include Student Model
const Student = require('../models/student')
// Include Instructor Model
const Instructor = require('../models/instructor')

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
  const username 		= req.body.username
  const password 		= req.body.password
  const password2 		= req.body.password2
  const type = req.body.type

  // Form Validation
  req.checkBody('first_name', 'First name field is required').notEmpty()
  req.checkBody('last_name', 'Last name field is required').notEmpty()
  req.checkBody('email', 'Email field is required').notEmpty()
  req.checkBody('email', 'Email must be a valid email address').isEmail()
  req.checkBody('username', 'Username field is required').notEmpty()
  req.checkBody('password', 'Password field is required').notEmpty()
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password)

  errors = req.validationErrors()

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
        		return done(null, user)
      		} else {
      			console.log('Invalid Password')
      			// Success Message
        		return done(null, false, { message: 'Invalid password' })
      		}
   	 	})
    })
  }
))

// Log User Out
router.get('/logout', function (req, res) {
  req.logout()
 	// Success Message
  req.flash('success_msg', 'You have logged out')
  	res.redirect('/')
})

module.exports = router
