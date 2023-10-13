const mongoose = require('mongoose')

// Student Schema
const StudentSchema = mongoose.Schema({
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

const Student = module.exports = mongoose.model('Student', StudentSchema)

module.exports.getStudentByUsername = function (username, callback) {
  const query = { username }
  Student.findOne(query, callback)
}

// Register Student for Class
module.exports.register = function (info, callback) {
  student_username = info.student_username
  class_id = info.class_id
  class_title = info.class_title

  const query = { username: student_username }
  Student.findOneAndUpdate(
    query,
    { $push: { classes: { class_id, class_title } } },
    { safe: true, upsert: true },
    callback
  )
}
