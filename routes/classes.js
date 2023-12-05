const express = require('express');
const router = express.Router();
const Class = require('../models/class');
const fs = require('fs');
const path = require('path');

// Middleware function to log user activities
function logUserActivity(username, activity) {
  const logMessage = `${new Date().toISOString()} - User: ${username}, Activity: ${activity}\n`;
  const logFolderPath = path.join(__dirname, '..', 'reports');
  const logFilePath = path.join(logFolderPath, `${username}_activity_log.txt`);

  // Ensure the 'reports' folder exists
  if (!fs.existsSync(logFolderPath)) {
    fs.mkdirSync(logFolderPath);
  }

  // Log the activity
  fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// Classes Page
router.get('/', function (req, res, next) {
  logUserActivity(req.user.username, 'Accessed Classes Page');
  Class.getClasses(function (err, classes) {
    if (err) throw err;
    res.render('classes/index', { classes });
  }, 3);
});

// Class Details
router.get('/:id/details', function (req, res, next) {
  // Add activity logging if needed
  Class.getClassById(req.params.id, function (err, classname) {
    if (err) throw err;
    res.render('classes/details', { class: classname });
  });
});

// Get Lessons
router.get('/:id/lessons', function (req, res, next) {
  logUserActivity(req.user.username, 'Accessed Lessons Page');
  Class.getClassById(req.params.id, function (err, classname) {
    if (err) throw err;
    res.render('classes/lessons', { class: classname });
  });
});

// Get Lesson
router.get('/:id/lessons/:lesson_id', function (req, res, next) {
  logUserActivity(req.user.username, 'Accessed Lesson');
  Class.getClassById(req.params.id, function (err, classname) {
    let lesson;
    if (err) throw err;
    for (let i = 0; i < classname.lessons.length; i++) {
      if (classname.lessons[i].lesson_number == req.params.lesson_id) {
        lesson = classname.lessons[i];
        break;
      }
    }
    res.render('classes/lesson', { class: classname, lesson });
  });
});

// GET request to render the lesson as raw HTML for editing
router.get('/:id/lessons/:lesson_id/edit', function (req, res, next) {
  logUserActivity(req.user.username, 'Accessed Edit Lesson Page');
  Class.getClassById(req.params.id, function (err, classname) {
    let lesson;
    if (err) throw err;
    for (let i = 0; i < classname.lessons.length; i++) {
      if (classname.lessons[i].lesson_number == req.params.lesson_id) {
        lesson = classname.lessons[i];
        break;
      }
    }
    res.render('classes/editlesson', { class: classname, lesson });
  });
});

// POST request to update the lesson content
router.post('/:id/lessons/:lesson_number/edit', function (req, res, next) {
  // Retrieve the class by classId
  Class.getClassById(req.params.id, function (err, classname) {
    if (err) throw err;

    // Find the lesson by lesson_number
    let lesson;
    for (let i = 0; i < classname.lessons.length; i++) {
      if (classname.lessons[i].lesson_number == req.params.lesson_number) {
        lesson = classname.lessons[i];
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

      // Save the updated lesson to the database
      classname.save(function (err) {
        if (err) throw err;

        // Redirect to the lessons page after successfully updating the lesson
        res.redirect('/classes/' + req.params.id + '/lessons');
      });
    }
  });
});

module.exports = router;
