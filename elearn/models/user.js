const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// User Schema
const UserSchema = mongoose.Schema({
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String,
    bcrypt: true
  },
  type: {
    type: String
  }
})

const User = module.exports = mongoose.model('User', UserSchema)

// Get User By Id
module.exports.getUserById = function (id, callback) {
  User.findById(id, callback)
}

// Get User by Username
module.exports.getUserByUsername = function (username, callback) {
  const query = { username }
  User.findOne(query, callback)
}

// Compare password
module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err
    callback(null, isMatch)
  })
}

// Create Student User
module.exports.saveStudent = function (newUser, newStudent, callback) {
  bcrypt.hash(newUser.password, 10, function (err, hash) {
    if (err) throw err

    // Set hash
    newUser.password = hash

    console.log('Student is being saved')

    newUser.save(function (err) {
      if (err) throw err

      newStudent.save(function (err) {
        if (err) throw err
        callback()
      })
    })
  })
}

// Create Instructor User
module.exports.saveInstructor = function (newUser, newInstructor, callback) {
  bcrypt.hash(newUser.password, 10, function (err, hash) {
    if (err) throw err

    // Set hash
    newUser.password = hash

    console.log('Instructor is being saved')

    newUser.save(function (err) {
      if (err) throw err

      newInstructor.save(function (err) {
        if (err) throw err
        callback()
      })
    })
  })
}
