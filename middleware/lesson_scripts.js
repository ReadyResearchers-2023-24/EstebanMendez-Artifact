// lesson_scripts.js
/* eslint-disable camelcase */

// Define the afterPyReplExec function for Lesson 1
let consoleLog1 = ''
let resultIsCorrect1 = false

function continuouslyCaptureConsoleLog1 () {
  const originalLog = console.log
  console.log = function (message) {
    consoleLog1 += message + '\n'
    originalLog.apply(console, arguments)
  }

  const intervalId = setInterval(function () { // eslint-disable-line no-unused-vars
    setTimeout(function () {
      console.log = originalLog
      processConsoleLog1(consoleLog1)
      consoleLog1 = ''
    }, 1000)
  }, 500)
}

function processConsoleLog1 (log) {
  const expected_output = '{{lesson.lesson_result_script1}}' // Replace with the expected output for Lesson 1

  if (resultIsCorrect1) {
    return
  }

  if (log.includes(expected_output)) {
    document.getElementById('lessonResult1').textContent = 'Correct'
    document.getElementById('lessonResult1').style.color = 'green'
    resultIsCorrect1 = true
  } else {
    document.getElementById('lessonResult1').textContent = 'Incorrect. Please try again.'
    document.getElementById('lessonResult1').style.color = 'red'
  }
}

continuouslyCaptureConsoleLog1()

// Define the afterPyReplExec function for Lesson 2 (similarly for Lesson 3)
// You can copy the above code and modify it for Lesson 2 and Lesson 3
// Define the afterPyReplExec function for Lesson 2
let consoleLog2 = ''
const resultIsCorrect2 = false

function continuouslyCaptureConsoleLog2 () {
  const originalLog = console.log
  console.log = function (message) {
    consoleLog2 += message + '\n'
    originalLog.apply(console, arguments)
  }

  const intervalId = setInterval(function () { // eslint-disable-line no-unused-vars
    setTimeout(function () {
      console.log = originalLog
      processConsoleLog2(consoleLog2)
      consoleLog2 = ''
    }, 1000)
  }, 500)
}

function processConsoleLog2 (log) {
  const expected_output = '{{lesson.lesson_result_script2}}' // Replace with the expected output for Lesson 1

  if (resultIsCorrect2) {
    return
  }

  if (log.includes(expected_output)) {
    document.getElementById('lessonResult2').textContent = 'Correct'
    document.getElementById('lessonResult2').style.color = 'green'
    resultIsCorrect1 = true
  } else {
    document.getElementById('lessonResult2').textContent = 'Incorrect. Please try again.'
    document.getElementById('lessonResult2').style.color = 'red'
  }
}

continuouslyCaptureConsoleLog2()

// Define the afterPyReplExec function for Lesson 3
let consoleLog3 = ''
const resultIsCorrect3 = false

function continuouslyCaptureConsoleLog3 () {
  const originalLog = console.log
  console.log = function (message) {
    consoleLog3 += message + '\n'
    originalLog.apply(console, arguments)
  }

  const intervalId = setInterval(function () { // eslint-disable-line no-unused-vars
    setTimeout(function () {
      console.log = originalLog
      processConsoleLog3(consoleLog3)
      consoleLog3 = ''
    }, 1000)
  }, 500)
}

function processConsoleLog3 (log) {
  const expected_output = '{{lesson.lesson_result_script3}}' // Replace with the expected output for Lesson 1

  if (resultIsCorrect3) {
    return
  }

  if (log.includes(expected_output)) {
    document.getElementById('lessonResult3').textContent = 'Correct'
    document.getElementById('lessonResult3').style.color = 'green'
    resultIsCorrect1 = true
  } else {
    document.getElementById('lessonResult3').textContent = 'Incorrect. Please try again.'
    document.getElementById('lessonResult3').style.color = 'red'
  }
}

continuouslyCaptureConsoleLog3()
