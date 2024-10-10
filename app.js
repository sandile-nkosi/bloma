require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const database = require('./config/database').MongoURI;
const flash = require('connect-flash');
const expressSession = require('express-session');
const createSessionConfig = require('./config/session');
// App routes
const baseRoutes = require('./routes/base.routes');
const studentRoutes = require('./routes/student.routes');
const adminRoutes = require('./routes/admin.routes');
const residenceRoutes = require('./routes/residence.routes');
const applicationRoutes = require('./routes/application.routes');


const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use('/student/student-data', express.static('student-data'));
app.use(bodyParser.urlencoded({ extended: true }));


const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));




//Connect flash for messages 
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    next();
});


// Use app routes
app.use('/', baseRoutes);
app.use('/student', studentRoutes);
app.use('/residences', residenceRoutes);
app.use('/application', applicationRoutes);
app.use('/admin', adminRoutes);


// Database connection
mongoose.connect(database).then(()=>{
    console.log('Database connection established');
}).catch((err)=>{
    console.error('Database connection error', err);
});

const PORT = process.env.PORT || 443;

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});