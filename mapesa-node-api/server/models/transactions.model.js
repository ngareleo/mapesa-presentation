const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransactionSchema = new Schema({
  type: String,
  message: String,
  message_id: Number,
  transaction_code: String,
  transaction_amount: Number,
  subject: String,
  subject_phoneNumber: String,
  subject_account: String,
  dateTime: Date,
  balance: Number,
  transaction_cost: Number,
  location: String,
  user_id: String,
})

module.exports = mongoose.model('Transaction', TransactionSchema)
