const express = require('express');
const router = express.Router();

const Class = require('../models/class');
const { checkInstructor } = require('../middleware/middleware');

// Classes Page
router.get('/', function (req, res, next) {
  Class.getClasses(function (err, classes) {
    if (err) throw err;
    res.render('classes/index', { classes });
  }, 3);
});

// Class Details
router.get('/:id/details', function (req, res, next) {
  Class.getClassById(req.params.id, function (err, className) {
    if (err) throw err;
    res.render('classes/details', { class: className });
  });
});

// // Get Lessons
// router.get('/:id/lessons', function (req, res, next) {
//   Class.getClassById(req.params.id, function (err, className) {
//     if (err) throw err;
//     res.render('classes/lessons', { class: className });
//   });
// });

// Get Lessons
router.get('/:id/lessons', function (req, res, next) {
  Class.getClassById(req.params.id, function (err, className) {
    if (err) throw err;
    
    // Determine if the user is an instructor
    const isInstructor = req.user && req.user.type === 'instructor';

    res.render('classes/lessons', { class: className, isInstructor });

    // Save changes to the session after rendering the template
    req.session.save();
  });
});


// Get Lesson
router.get('/:id/lessons/:lesson_id', function (req, res, next) {
  Class.getClassById(req.params.id, function (err, className) {
    let lesson;
    if (err) throw err;
    for (let i = 0; i < className.lessons.length; i++) {
      if (className.lessons[i].lesson_number == req.params.lesson_id) {
        lesson = className.lessons[i];
        break;
      }
    }
    res.render('classes/lesson', { class: className, lesson });
  });
});

// GET request to render the lesson as raw HTML for editing
router.get('/:id/lessons/:lesson_id/edit', checkInstructor, (req, res, next) => {
  Class.getClassById(req.params.id, function (err, className) {
    let lesson;
    if (err) throw err;
    for (let i = 0; i < className.lessons.length; i++) {
      if (className.lessons[i].lesson_number == req.params.lesson_id) {
        lesson = className.lessons[i];
        break;
      }
    }
    res.render('classes/editlesson', { class: className, lesson });
  });
});

// POST request to update the lesson content
router.post('/:id/lessons/:lesson_number/edit', checkInstructor, (req, res, next) => {
  // Retrieve the class by classId
  Class.getClassById(req.params.id, function (err, className) {
    if (err) throw err;

    // Find the lesson by lesson_number
    let lesson;
    for (let i = 0; i < className.lessons.length; i++) {
      if (className.lessons[i].lesson_number == req.params.lesson_number) {
        lesson = className.lessons[i];
        break;
      }
    }

    if (!lesson) {
      // Handle the case where the lesson is not found
      // You can customize this part to display an error message or handle it as needed.
      res.redirect('/classes/' + req.params.id + '/lessons');
    } else {
      // Update lesson content with the data from the form
      lesson.lesson_title = req.body.lesson_title;
      lesson.lesson_body = req.body.lesson_body;
      lesson.lesson_body2 = req.body.lesson_body2;
      lesson.lesson_body3 = req.body.lesson_body3;
      lesson.lesson_code = req.body.lesson_code;
      lesson.lesson_code2 = req.body.lesson_code2;
      lesson.lesson_code3 = req.body.lesson_code3;
      lesson.lesson_result_script1 = req.body.lesson_result_script1;
      lesson.lesson_result_script2 = req.body.lesson_result_script2;
      lesson.lesson_result_script3 = req.body.lesson_result_script3;

      // Save the updated lesson to the database
      className.save(function (err) {
        if (err) throw err;

        // Redirect to the lessons page after successfully updating the lesson
        res.redirect('/classes/' + req.params.id + '/lessons');
      });
    }
  });
});

module.exports = router;
