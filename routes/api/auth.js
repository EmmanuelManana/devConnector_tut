const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const gravatar = require('gravatar');
const bcrytpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

//@route    GET api/auth
//@desc     auth  route
//@access   public
// the auth middleware(validates the token)
router.get('/', auth, async (req, res) => {
  //make a call to our database.
  try {
    //make a 'query' to the database
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route    POST api/users
//@desc     Register user
//@access   Public
router.post(
  '/',
  [
    check('email', 'email is invalid').isEmail(),
    check('password', 'password is required').exists()
  ],
  async (req, res) => {
    //check for errors in the request.
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ MyErrors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //  check user exists(request to db to get user)
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ erros: [{ msg: 'Invalid credentials' }] });
      }

      //check password
      const isMatch = await bcrytpt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ erros: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
