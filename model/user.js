const mongoose = require('mongoose');

const {Schema} = mongoose;
const userSchema = new Schema({
  id: {
    type: String,
    unique: true,
    require: true,
    minLength: 4,
    maxLength: 15,
  },
  password: {
    type: String,
    require: true,
  },
  salt: {
    type: String,
    require: true,
  },
  wins: {
    type: Number,
    default: 0,
  },
  loses: {
    type: Number,
    default: 0,
  },
  roomId: {
    type: Schema.Types.ObjectId, // 외래키
    ref: 'Room'
  }
});

module.exports = mongoose.model('User', userSchema);