const express = require('express')
const User = require('../model/user');

const router = express.Router();

router.get('/', async (req, res) => {
  const {id} = req.query;
  const user = await User.findOne({id});

  return res.status(200).json({
    status: 200,
    win: user.wins,
    lose: user.loses,
    id: user.id,
  })
})
module.exports = router;