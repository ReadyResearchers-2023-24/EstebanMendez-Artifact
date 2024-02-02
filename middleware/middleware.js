// middleware.js
function checkInstructor(req, res, next) {
    // Check if the user is an instructor
    // Implement your logic here to determine if the user is an instructor
    if (req.user && req.user.type === 'instructor') {
      return next();
    } else {
      res.status(401).send('Unauthorized');
    }
}
  
module.exports = {
    checkInstructor
};
