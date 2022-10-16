const express = require("express");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const morgan = require("morgan");
const appConfigs = require("./config");
const viewsDir = path.join(__dirname, "server", "views");
const app = express();
const slowDown = require("express-slow-down");
const speedLimiter = slowDown(appConfigs.speedLimiterConfigs);
// const rateLimit = require("express-rate-limit");
// const apiLimiter = rateLimit(
//   appConfigs.rateLimitConfigs(rateLimit.MemoryStore)
// );

appConfigs.initDbConnection;

//settings
app.set("views", viewsDir);
app.set("view engine", "jade");

// app configs
require("./server/boot/auth.boot")();
require("dotenv").config();
require("http-errors");
app.use(require("cors"));
app.use(speedLimiter);
app.use(session(appConfigs.sessionConfig));
app.use(morgan("dev"));
app.use(express.json(appConfigs.jsonConfig));
app.use(express.urlencoded(appConfigs.urlEncodingConfigs));
app.use(require("cookie-parser"));
app.use(express.static(path.join(__dirname, "server", "public")));
app.use(passport.initialize());
app.use(passport.session());

//middleware
app.use(require("./server/middleware/handleUserRedirect.middleware"));

//routes
app.use(require("./server/routes/index.router"));
app.use(require("./server/routes/login.router"));
app.use(require("./server/routes/logout.router"));
app.use(require("./server/routes/signup.router"));
app.use(require("./server/routes/upload.router"));
app.use(require("./server/routes/data.router"));
app.use(require("./server/routes/is_authenticated.router"));
app.use(require("./server/routes/loginFailure.router"));
app.use(require("./server/routes/test.router"));
app.use(require("./server/errors/500.errors"));
app.use(require("./server/errors/404.errors"));

module.exports = app;
