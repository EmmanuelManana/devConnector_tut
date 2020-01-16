const express = require('express');
const router = express.Router();

//@route    GET api/users
//@desc     users route
//@access   public
router.get('/', (req, res) => {
    res.send('user route test')
})

module.exports = router;