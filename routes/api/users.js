const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrytpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const nameV = require('../../middleware/validateUser');

//bring User model(the Schema).
const User = require('../../models/User');

//@route    POST api/users
//@desc     Register user
//@access   Public
router.post(
  '/',
  nameV,
  // [
  //   //express-check
  //   check('name', 'name is empty')
  //     .not()
  //     .isEmpty(),

  //   check('email', 'email is invalid').isEmail(),
  //   check('password', 'password must exceed 5 characters').isLength({ min: 5 })
  // ],
  async (req, res) => {
    //check for errors in the request.
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ MyErrors: errors.array() });
    }

    const { name, email, password } = req.body;
    // if (nameC(name)) {
    //   console.log('the name is invalid');
    //   //add to the database.
    // }

    try {
      //  check (db) user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ erros: [{ msg: 'User already exits ' }] });
      }
      // Get users Gravatar, link user profile using an email address
      const avatar = gravatar.url(email, {
        s: '200',
        d: 'mm',
        r: 'pg'
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt with bcrytpt
      const salt = await bcrytpt.genSalt(10);
      user.password = await bcrytpt.hash(password, salt);

      //save user to the(register user into the database)
      await user.save();
      // res.send('user registered');

      // Return jsonwebtoken, to authenticate,permit user access protected routes  header.payload.signature
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
