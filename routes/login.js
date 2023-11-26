const express = require('express')
const {createHashedPassword, makePasswordHashed} = require('../modules/hash');
const User = require('../model/user');
const jwtUtils = require('../modules/jwt')

const router = express.Router();
router.post('/', async (req, res) => {
  const {id, password} = req.body;
  const user = await User.findOne({id});

  if (!user) {
    return res.json({
      status: 409,
      message: '해당하는 아이디가 존재하지 않습니다.'
    })
  }

  const hashedPassword = await makePasswordHashed(id, password);


  if (hashedPassword === user.password) {
    const token = await jwtUtils.sign(user);
    res.cookie('token', token, {
      maxAge: 60 * 60,
    });
    return res.status(201).json({status: 201, id: user.id, token})
  } else {
    return res.json({
      status: 409,
      message: '로그인에 실패하였습니다.'
    })
  }
})

module.exports = router;