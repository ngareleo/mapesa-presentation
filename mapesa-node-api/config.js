var mongoose = require('mongoose')
let database = process.env.DATABASE
const uri = `mongodb://127.0.0.1:27017/Mapesa`
let server = process.env.SERVER || 'localhost'

class Connection {
  constructor() {
    this._connect()
  }

  _connect() {
    mongoose
      .connect(uri, {
        useNewURLParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Database connection successful')
      })
      .catch((err) => {
        console.error('Database connection error')
      })
  }
}

module.exports = new Connection()
