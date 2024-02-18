const express = require('express')
const router = express.Router()

const Class = require('../models/class')
const Instructor = require('../models/instructor')
const User = require('../models/user')
const { checkInstructor } = require('../middleware/middleware');

router.get('/classes', function (req, res, next) {
  Instructor.getInstructorByUsername(req.user.username, function (err, instructor) {
    if (err) throw err
    res.render('instructors/classes', { instructor })
  })
})

router.post('/classes/register', function (req, res) {
  const info = []
  info.instructor_username = req.user.username
  info.class_id = req.body.class_id
  info.class_title = req.body.class_title

  Instructor.register(info, function (err, instructor) {
    if (err) throw err
    console.log(instructor)
  })

  req.flash('success_msg', 'You are now registered to teach this class')
  res.redirect('/instructors/classes')
})

router.get('/classes/:id/lessons/new', checkInstructor, function (req, res, next) {
  res.render('instructors/newlesson', { class_id: req.params.id })
})

router.post('/classes/:id/lessons/new', checkInstructor, (req, res, next) => {
  // Get Values
  const info = []
  info.class_id = req.params.id
  info.lesson_number = req.body.lesson_number
  info.lesson_title = req.body.lesson_title
  info.lesson_body = req.body.lesson_body
  info.lesson_body2 = req.body.lesson_body2
  info.lesson_body3 = req.body.lesson_body3
  info.lesson_code = req.body.lesson_code
  info.lesson_code2 = req.body.lesson_code2
  info.lesson_code3 = req.body.lesson_code3
  info.lesson.lesson_result_script1 = req.body.lesson_result_script1;
  info.lesson.lesson_result_script2 = req.body.lesson_result_script2;
  info.lesson.lesson_result_script3 = req.body.lesson_result_script3;

  Class.addLesson(info, function (err, lesson) {
    console.log('Lesson Added..')
  })

  req.flash('success_msg', 'Lesson Added')
  res.redirect('/instructors/classes')
})

module.exports = router
