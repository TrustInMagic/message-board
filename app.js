require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
// models
const User = require('./models/user');
// authentication
const passport = require('passport');
const session = require('express-session');
const localStrategy = require('passport-local').Strategy;
// bcrypt
const bcrypt = require('bcryptjs');
// routes
const indexRouter = require('./routes/index');
const registrationRouter = require('./routes/registration');
const logInRouter = require('./routes/log-in');
const logOutRouter = require('./routes/log-out');
const accountCreatedRouter = require('./routes/account-created');
const newPostRouter = require('./routes/new-post');

async function main() {
  await mongoose.connect(mongoURI);
}

const app = express();

// db
const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI;
mongoose.set('strictQuery', false);
main().catch((err) => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// passport config
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
passport.use(
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ email: username });
        const match = await bcrypt.compare(password, user.password);

        if (!user || !match) {
          return done(null, false, {
            message: 'Incorrect username or password',
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SECRET_PASSPORT,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(flash());

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/registration', registrationRouter);
app.use('/log-in', logInRouter);
app.use('/log-out', logOutRouter);
app.use('/account-created', accountCreatedRouter);
app.use('/new-post', newPostRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
