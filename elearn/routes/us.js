const express = require('express')
const router = express.Router()

// Import any necessary models or data here

// About Us Page
router.get('/', function (req, res, next) {
  // Add logic to fetch information about your eLearning system and developer
  const eLearningSystemInfo = {
    name: 'ProgMagus',
    description: 'An innovative eLearning system',
    developer: 'Esteban Mendez',
    developerDescription: 'Software Engineer from Allegheny College'
    // Add more information as needed
  }

  res.render('us/index', { eLearningSystemInfo })
  // ^^^ Make sure you are rendering 'aboutUs/index', not 'classes/index'
})

module.exports = router
