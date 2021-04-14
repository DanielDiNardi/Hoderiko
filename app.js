const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('HAMDatabase.db');
const {ROLE} = require('./data');
const {isAuthenticatedAdmin, isAuthenticatedTeacher, isAuthenticatedStudent, isRole} = require('./auth');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
var userID;

const userLogIn = "SELECT id, email, password FROM User WHERE email = $1;";
const findUserbyID = "SELECT id FROM User WHERE id = $1;";

const app = express();

app.use(express.json());
app.use(setUser);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/"));
app.listen(3000, function(){
    console.log('Server started, Hello Hoderiko :)');
});
app.use(session({
    secret: 'R2W4BNGUGRLH8V0WTN3URVPNLBDKBR2DD4DB5ELDV8CCTADD5X01JDZBH0BXTJ9I',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
    res.sendFile(__dirname + '/HTML/index.html');
});

app.get('/loginHub', function(req, res){
    res.sendFile(__dirname + '/HTML/role.html');
});

app.get('/adminLogIn', function(req, res){
    res.sendFile(__dirname + '/HTML/adminLogIn.html');
});

app.get('/adminDashboard', isAuthenticatedAdmin(), isRole(ROLE.ADMIN), function(req, res) {
    res.sendFile(__dirname + '/HTML/adminDashboard.html');
});

app.get('/teacherLogIn', function(req, res){
    res.sendFile(__dirname + '/HTML/teacherLogIn.html');
});

app.get('/teacherDashboard', isAuthenticatedTeacher(), isRole(ROLE.TEACHER), function(req, res) {
    res.sendFile(__dirname + '/HTML/teacherDashboard.html');
});

app.get('/studentLogIn', function(req, res){
    res.sendFile(__dirname + '/HTML/studentLogIn.html');
});

app.get('/studentDashboard', isAuthenticatedStudent(), isRole(ROLE.STUDENT), function(req, res) {
    res.sendFile(__dirname + '/HTML/studentDashboard.html');
});

function setUser(req, res, next) {
    if (userID) {
        req.user = userID;
    }
    next();
}

passport.use(new LocalStrategy( { usernameField: 'email', passwordField: 'password'},
    function(email, password, done) {
        const query = db.prepare(userLogIn);
        query.get(email, function(err, row) {
            if (err) { return done(err); }
            if (!row) { return done(null, false, { message: 'User not found.' }); }
            if(password == row.password) {
                done(null, { id: row.id });
                    userID = row.id;
                    console.log(userID);
            }
            else  {
                return done(null, false, { message: 'Incorrect password' });
            }
        });
    }
));



passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    const query = db.prepare(findUserbyID);
    query.get(id, function(err, row) {
        done(err, row);
    });
});

app.post('/adminLogIn', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        
        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            console.log(info);
            console.log("Access Denied");
            return res.redirect('/adminLogIn');
        }
        req.logIn(user, function(err) {
            if (err) {
                console.log(err);
                return next(err);
            }
            console.log("Access Granted");
            return res.redirect('/adminDashboard');
        });
    })(req, res, next);
});
