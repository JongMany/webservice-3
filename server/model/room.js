const {Schema} = require("mongoose");
const mongoose = require("mongoose");


const roomSchema = new Schema({
  id: {
    type: String,
    unique: true,
    require: true,
  },
  users: {
    type: [{
      type: Schema.Types.ObjectId, // 외래키
      ref: 'User',
    }],
    validate: [arrayLimit, '{PATH} exceeds the limit of 2'], // 개수 제한
  },
});

function arrayLimit(val) {
  return val.length <= 2;
}

module.exports = mongoose.model('Room', roomSchema);