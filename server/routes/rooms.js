const express = require('express')
// const User = require('../model/user');
const Room = require('../model/room');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    // console.log(rooms);
    return res.json({
      status: 200,
      // rooms: Object.keys(rooms),
      rooms: rooms,
    })
  } catch (error) {
    return res.json({
      status: 409,
      message: '방 찾는데 에러가 발생했습니다.'
    })
  }


})

module.exports = router;