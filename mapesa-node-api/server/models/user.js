const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  hash: String,
  salt: String,
})

module.exports = mongoose.model('User', userSchema)
