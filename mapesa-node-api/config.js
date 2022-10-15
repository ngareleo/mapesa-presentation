const mongoose = require("mongoose");
const uri = `mongodb://127.0.0.1:27017/Mapesa`;
const crypto = require("crypto");

class Connection {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(uri, {
        useNewURLParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error(`Database error occured. Err : ${err}`);
      });
  }
}

module.exports.dbConnection = new Connection();
module.exports.sessionConfig = {
  secret: "Secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000,
  },
};
module.exports.urlEncodingConfigs = {
  limit: "500mb",
  extended: false,
  parameterLimit: 100000,
};

module.exports.jsonConfig = {
  limit: "500mb",
};
