const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

//bring user model
const User = require('../../models/User');

//@route    POST api/users
//@desc     Register user
//@access   Public
router.post(
  '/',
  [
    check('name', 'name is empty')
      .not()
      .isEmpty(),
    check('email', 'email is invalid').isEmail(),
    check('password', 'password must exceed 5 characters').isLength({ min: 5 })
  ],
  //instead of promises, we implement the new async-await method.
  async (req, res) => {
    //(req.body) an object of data sent to this route,;
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ MyErrors: errors.array() });
    }

    // init from the body(req.body) in that order.
    const { name, email, password } = req.body;

    try {
      // see if user exists

      // Get users Gravatar

      // Encrypt with bcrytpt

      // Return jsonwebtoken
      res.send('user route');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
