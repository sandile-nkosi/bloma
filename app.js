require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const database = require('./config/database').MongoURI;
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');
const createSessionConfig = require('./config/session');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(createSessionConfig());


// Passport session middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    next();
});


// Routes
app.use('/', require('./routes/base.routes'));
app.use('/student', require('./routes/student.routes'));
app.use('/residences', require('./routes/residence.routes'));

mongoose.connect(database).then(()=>{
    console.log('Database connection established');
}).catch((err)=>{
    console.error('Database connection error', err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});