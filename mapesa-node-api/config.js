const mongoose = require("mongoose");
const uri = process.env.DATABASE_URI;

module.exports.initDbConnection = () => {
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
};

module.exports.sessionConfig = {
  secret: process.env.SESSION_SECRET,
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

module.exports.speedLimiterConfigs = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100:
};

module.exports.rateLimitConfigs = (MemoryStore) => {
  return {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    store: new MemoryStore(),
  };
};
