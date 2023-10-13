const mongoose = require('mongoose')

// Instrucor Schema
const InstructorSchema = mongoose.Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  address: [{
    street_address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String }
  }],
  username: {
    type: String
  },
  email: {
    type: String
  },
  classes: [{
    class_id: { type: [mongoose.Schema.Types.ObjectId] },
    class_title: { type: String }
  }]
})

const Instructor = module.exports = mongoose.model('instructor', InstructorSchema)

module.exports.getInstructorByUsername = function (username, callback) {
  const query = { username }
  Instructor.findOne(query, callback)
}

// Register Instructor for Class
module.exports.register = function (info, callback) {
  instructor_username = info.instructor_username
  class_id = info.class_id
  class_title = info.class_title

  const query = { username: instructor_username }
  Instructor.findOneAndUpdate(
    query,
    { $push: { classes: { class_id, class_title } } },
    { safe: true, upsert: true },
    callback
  )
}
