/* eslint-disable camelcase */

const express = require('express')
const router = express.Router()

const Class = require('../models/class')
const Student = require('../models/student')
const User = require('../models/user')

router.get('/classes', function (req, res, next) {
  Student.getStudentByUsername(req.user.username, function (err, student) {
    if (err) throw err
    res.render('students/classes', { student })
  })
})

// Register Student for Class
router.post('/classes/register', function (req, res) {
  const student_username = req.user.username
  const class_id = req.body.class_id
  const class_title = req.body.class_title

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

module.exports = router
