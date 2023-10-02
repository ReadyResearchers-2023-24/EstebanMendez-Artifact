var express = require('express');
var router = express.Router();

Class = require('../models/class');
Instructor = require('../models/instructor');
User = require('../models/user');

router.get('/classes', function(req, res, next){
	Instructor.getInstructorByUsername(req.user.username, function(err, instructor){
		if(err) throw err;
		res.render('instructors/classes', {instructor: instructor});
	});
});

router.post('/classes/register', function(req, res){
	info = [];
	info['instructor_username'] = req.user.username;
	info['class_id'] = req.body.class_id;
	info['class_title'] = req.body.class_title;

	Instructor.register(info, function(err, instructor){
		if(err) throw err;
		console.log(instructor);
	});

	req.flash('success_msg', 'You are now registered to teach this class');
	res.redirect('/instructors/classes');
});

router.get('/classes/:id/lessons/new', function(req, res, next){
	res.render('instructors/newlesson',{class_id:req.params.id});
});

router.post('/classes/:id/lessons/new', function(req, res, next){
	// Get Values
	var info = [];
	info['class_id'] = req.params.id;
	info['lesson_number'] = req.body.lesson_number;
	info['lesson_title'] = req.body.lesson_title;
	info['lesson_body'] = req.body.lesson_body;
	info['lesson_body2'] = req.body.lesson_body2;
	info['lesson_body3'] = req.body.lesson_body3;
    info['lesson_code'] = req.body.lesson_code;
	info['lesson_code2'] = req.body.lesson_code2;
	info['lesson_code3'] = req.body.lesson_code3;

	Class.addLesson(info, function(err, lesson){
		console.log('Lesson Added..');
	});

	req.flash('success_msg','Lesson Added');
	res.redirect('/instructors/classes');
});

// GET request to render the lesson as raw HTML for editing
router.get('/classes/:classId/lessons/edit/:lessonId', function(req, res, next){
    Lesson.getLessonById(req.params.lessonId, function(err, lesson){
        if (err) throw err;

        // Render the lesson as raw HTML for editing
        res.render('instructors/editlesson', { lesson });
    });
});

// POST request to update the lesson content
router.post('/classes/:classId/lessons/update/:lessonId', function(req, res, next){
    // Retrieve the lesson by lessonId
    Lesson.getLessonById(req.params.lessonId, function(err, lesson){
        if (err) throw err;

        // Update lesson content with the data from the form
        lesson.lesson_number = req.body.lesson_number;
        lesson.lesson_title = req.body.lesson_title;
        lesson.lesson_body = req.body.lesson_body;
        lesson.lesson_code = req.body.lesson_code;

        // Save the updated lesson
        lesson.save(function(err) {
            if (err) throw err;

            // Redirect to the lesson view page or another appropriate location
            res.redirect('/classes/' + lesson.class_id + '/lessons');
        });
    });
});




module.exports = router;