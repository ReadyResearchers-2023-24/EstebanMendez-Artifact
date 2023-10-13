const express = require('express')
const router = express.Router()

const Class = require('../models/class')

// Classes Page
router.get('/', function (req, res, next) {
  Class.getClasses(function (err, classes) {
    if (err) throw err
    res.render('classes/index', { classes })
  }, 3)
})

// Class Details
router.get('/:id/details', function (req, res, next) {
  Class.getClassById([req.params.id], function (err, classname) {
    if (err) throw err
    res.render('classes/details', { class: classname })
  })
})

// Get Lessons
router.get('/:id/lessons', function (req, res, next) {
  Class.getClassById([req.params.id], function (err, classname) {
    if (err) throw err
    res.render('classes/lessons', { class: classname })
  })
})

// Get Lesson
router.get('/:id/lessons/:lesson_id', function (req, res, next) {
  Class.getClassById([req.params.id], function (err, classname) {
    let lesson
    if (err) throw err
    for (i = 0; i < classname.lessons.length; i++) {
      if (classname.lessons[i].lesson_number == req.params.lesson_id) {
        lesson = classname.lessons[i]
      }
    }
    res.render('classes/lesson', { class: classname, lesson })
  })
})

// GET request to render the lesson as raw HTML for editing
router.get('/:id/lessons/:lesson_id', function (req, res, next) {
  Class.getClassById([req.params.id], function (err, classname) {
    let lesson
    if (err) throw err
    for (i = 0; i < classname.lessons.length; i++) {
      if (classname.lessons[i].lesson_number == req.params.lesson_id) {
        lesson = classname.lessons[i]
      }
    }
    res.render('classes/editlesson', { class: classname, lesson })
  })
})

// POST request to update the lesson content
router.post('/:id/lessons/:lesson_id', function (req, res, next) {
  // Retrieve the lesson by lessonId
  Class.getClassById([req.params.id], function (err, lesson) {
    var lesson
    if (err) throw err

    // Update lesson content with the data from the form
    lesson.lesson_number = req.body.lesson_number
    lesson.lesson_title = req.body.lesson_title
    lesson.lesson_body = req.body.lesson_body
    lesson.lesson_body2 = req.body.lesson_body2
    lesson.lesson_body3 = req.body.lesson_body3
    lesson.lesson_code = req.body.lesson_code
    lesson.lesson_code2 = req.body.lesson_code2
    lesson.lesson_code3 = req.body.lesson_code3

    // Save the updated lesson
    lesson.save(function (err) {
      if (err) throw err

      // Redirect to the lesson view page or another appropriate location
      res.redirect('/classes/' + lesson.class_id + '/lessons')
    })
  })
})

module.exports = router
