const express = require('express')
const {createHashedPassword} = require('../modules/hash');
const router = express.Router();
const User = require('../model/user');

router.post('/', async (req, res, next) => {
  const {id, password} = req.body;

  const users = await User.find({id});
  // 이미 유저가 있는 경우,
  if (users.length > 0) {
    return res.status(409).json({
      status: 409,
    });
  }

  // 유저가 없는 경우,
  const {password: hashedPassword, salt} = await createHashedPassword(password);
  try {
    const user = await User.create({
      id,
      password: hashedPassword,
      salt,
    });
    if (user) {
      return res.status(201).json({
        status: 201,
      })
    }
  } catch (error) {
    console.error(error);
    return res.status(409).json({
      status: 409,
      error,
    });
  }
});

router.post('/duplicate-id', async (req, res, next) => {
  const {id} = req.body;
  if (id.length < 4) {
    return res.status(409).json({
      code: 409,
      message: "아이디 길이가 너무 짧습니다..."
    })
  }
  try {
    const users = await User.find({id});
    if (users.length > 0) {
      return res.json({
        status: 409,
        message: "이미 존재하는 아이디입니다."
      })
    } else {
      return res.status(200).json({
        status: 200,
      })
    }
  } catch (error) {
    console.error(error)
  }
})


module.exports = router;