const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const MongoStore = require('connect-mongo');



function createSessionConfig(){
  return session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.CONNSTRING,
      dbName: 'bloma',
      autoRemove: 'native'
     }),
     cookie: {
      maxAge: 0.5 * 24 * 60 * 60 * 1000
    }
  });
};

module.exports = createSessionConfig;