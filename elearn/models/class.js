const mongoose = require('mongoose')

// Class Schema
const ClassSchema = mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  instructor: {
    type: String
  },
  lessons: [{
    lesson_number: { type: Number },
    lesson_title: { type: String },
    lesson_body: { type: String },
    lesson_body2: { type: String },
    lesson_body3: { type: String },
    lesson_code: { type: String },
    lesson_code2: { type: String },
    lesson_code3: { type: String }
  }]
})

const Class = module.exports = mongoose.model('Class', ClassSchema)

// Fetch All Classes
module.exports.getClasses = function (callback, limit) {
  Class.find(callback).limit(limit)
}

// Fetch Single Class
module.exports.getClassById = function (id, callback) {
  Class.findById(id, callback)
}

// Add Lesson
module.exports.addLesson = function (info, callback) {
  class_id = info.class_id
  lesson_number = info.lesson_number
  lesson_title = info.lesson_title
  lesson_body = info.lesson_body
  lesson_body2 = info.lesson_body2
  lesson_body3 = info.lesson_body3
  lesson_code = info.lesson_code
  lesson_code2 = info.lesson_code2
  lesson_code3 = info.lesson_code3

  Class.findByIdAndUpdate(
    class_id,
    { $push: { lessons: { lesson_number, lesson_title, lesson_body, lesson_body2, lesson_body3, lesson_code, lesson_code2, lesson_code3 } } },
    { safe: true, upsert: true },
    callback
  )
}
