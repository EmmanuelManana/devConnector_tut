const jwt = require('jsonwebtoken');
const config = require('config');

function nameV(name) {
  var letters = /^[A-Za-z]+$/;

  if (regex.match(letters) == name) {
    return true;
  } else {
    return false;
  }
}

// middleware to help verify the token.
module.exports = function(req, res, next, err) {
  if (req.body && nameV(req.body.name)) {
    console.log(req.body.name);
    next();
  } else {
    next(new Error('Invalid input'));
  }
};
