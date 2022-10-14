require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");

//Routers
const indexRouter = require("./server/routes/index");
const uploadRouter = require("./server/routes/upload");
const testRouter = require("./server/routes/test");
const loginRouter = require("./server/routes/login");
const signupRouter = require("./server/routes/signup");
const failureRouter = require("./server/routes/loginFailure");
const isAuthenticatedRouter = require("./server/routes/is_authenticated");
const logoutRouter = require("./server/routes/logout");
const dataRouter = require("./server/routes/data");

//Express app

const app = express();
const viewsDir = path.join(__dirname, "server", "views");
const layoutsDir = path.join(viewsDir, "layouts");

// view engine setup

require("./config"); // our mongodb database instance
app.set("views", viewsDir);
app.set("view engine", "jade");

////////////////////////////////////////////////////////////////////

require("./server/boot/auth")();

app.use(cors());
dotenv.config();
app.use(
  session({
    secret: "ITS ABOUT TIME",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use(morgan("dev"));
app.use(
  express.json({
    limit: "500mb",
  })
);
app.use(
  express.urlencoded({
    limit: "500mb",
    extended: false,
    parameterLimit: 100000,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "server", "public")));

app.use(passport.initialize());
app.use(passport.session());

//check whether the user was visting somewhere else

app.use((req, res, next) => {
  let requested = req.session.redirect;
  if (requested != undefined) {
    if (req.isAuthenticated()) {
      delete req.session.redirect;
      res.redirect(requested);
    }
    next();
  } else {
    next();
  }
});

app.use(indexRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(signupRouter);
app.use(testRouter);
app.use(failureRouter);
app.use(uploadRouter);
app.use(isAuthenticatedRouter);
app.use(dataRouter);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render("error", {
    errorHeader: "505 Error",
    errorMsg: err.stack,
  });
});

// this should appear AFTER all of your routes
app.use(function (req, res) {
  res.status(404).render("error", {
    errorHeader: "404 Error",
    errorMsg: 'Page not Found',
  });
});

module.exports = app;
