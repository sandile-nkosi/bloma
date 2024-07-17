const Student = require('../models/Student');
const passport = require('passport');


function getLogin(req, res) {
    res.render('login');
};

function login(req, res, next) {
    const student = new Student({
        username: req.body.username,
        password: req.body.password
    });

    req.login(student, (err)=>{
        if (err){
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, ()=>{
                res.redirect('/student/dashboard');
            });
        }
    });
};

function logout(req, res){
    req.logout((err)=>{
        if(err){
            console.log(err);
        }else {
           res.redirect('/'); 
        }
    });
};

function register(req, res) { 
    const student = {
        username: req.body.username,
        studentNum: req.body.studentNum,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    };

    Student.register(new Student(student), req.body.password, (err, user)=>{
        if (err) {
            console.log(err);
            res.redirect('/student/register');
        } else {
            passport.authenticate('local')(req, res, ()=>{
                res.redirect('/student/login');
            });
        }
    });
};

function getDashboard(req, res) {
    if(req.isAuthenticated()){
        res.render('dashboard');
    }else {
        res.redirect('/student/login');
    };    
};

function getApply(req, res) {
    res.render('apply');
};

function getRegister(req, res){
    res.render('register');
};




module.exports = {
    getLogin: getLogin,
    getDashboard: getDashboard,
    getApply: getApply,
    getRegister: getRegister,
    login: login,
    logout: logout,
    register: register
};


