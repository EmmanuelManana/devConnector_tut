const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //Get the token from the header
  const token = req.header('x-auth-token');

  // Check for token
  if (!token) {
    return res
      .status(401)
      .json({ msg: 'No/Invalid token, authorization denied' });
  }

  //verify the token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
