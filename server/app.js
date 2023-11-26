var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require('cors');
const connectDB = require('./schema/index');
const {createServer} = require('http');
const socketHandler = require('./modules/socketHandler');

require("dotenv").config();

var indexRouter = require("./routes/index");
const joinRouter = require('./routes/join');
const loginRouter = require('./routes/login');
const roomRouter = require('./routes/rooms');
const recordRouter = require('./routes/record');

var app = express();
const server = createServer(app);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors({
  origin: "http://localhost:3000",
  // origin: "*",
  credentials: true,
  // optionsSuccessStatus: 200,
}))

connectDB();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use('/login', loginRouter);
app.use('/join', joinRouter);
app.use('/rooms', roomRouter);
app.use('/record', recordRouter);

socketHandler(server);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("something wrong!");
});


module.exports = app;
