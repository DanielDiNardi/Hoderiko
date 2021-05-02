const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('HAMDatabase.db');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const createCSVWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCSVWriter({
    path: 'report.csv',
    header: [
        { id: 'Name', title: 'NAME' },
        { id: 'ModuleName', title: 'MODULENAME' },
        { id: 'Attended', title: 'ATTENDANCE' },
        { id: 'classDate', title: 'CLASSDATE' },
        { id: 'classJoinTime', title: 'CLASSJOINDATE' }
    ]
});

const record = [];
var userID;
var userRole;
const ADMIN = 'ROLE.ADMIN';
const TEACHER = 'ROLE.TEACHER';
const STUDENT = 'ROLE.STUDENT';

const userLogIn = "SELECT id, email, password, role FROM User WHERE email = $1;";
const findUserbyID = "SELECT id FROM User WHERE id = $1;";
const selectModulesByStudent = "SELECT mName, mID FROM Course JOIN Module USING(mID) WHERE sID = $1;";
const selectExamsByStudent = "SELECT testName, testDate, testResult FROM Test WHERE sID = $1;";
const selectGradesByStudent = "SELECT mName, finalGrade FROM Grade JOIN Module USING(mID) WHERE sID = $1;";
const selectModulesByTeacher = "SELECT mName, mID FROM Module WHERE tID = $1;";
const selectTeacherStudentGrades = "SELECT name, mName, finalGrade FROM Grade JOIN Module USING(mID) JOIN user on(grade.sId = user.id) WHERE tID = $1;";
const selectExamsByTeacher = "SELECT testName, testDate, testResult FROM Test JOIN module USING(mID) WHERE tID = $1;";
const selectAllModules = "SELECT * FROM Module;";
const selectAllStudents = "SELECT * FROM User WHERE role = 'ROLE.STUDENT';";
const selectAllTeachers = "SELECT * FROM User WHERE role = 'ROLE.TEACHER';";
const selectUpcomingClassesByTeacher = "SELECT classID, mName, classDate, classStartTIme, classEndTime FROM module JOIN class USING(mID) WHERE tID = $1 AND mID = $2;";
const selectQRCodeInfo = "SELECT * FROM Class WHERE classID = $1;";
const getUserAttendance = "SELECT name, mName, attended, classDate, classJoinTime FROM userAttendedClass JOIN User on userAttendedClass.sID = User.id JOIN Class USING(classID) JOIN Module USING(mID);";



module.exports = {
    userLogInCheck: function () {
        return userLogIn;
    },

    findUserbyIDCheck: function () {
        return findUserbyID;
    },

    selectModulesByStudentCheck: function () {
        return selectModulesByStudent;
    },

    selectExamsByStudentCheck: function () {
        return selectExamsByStudent;
    },

    selectGradesByStudentCheck: function () {
        return selectGradesByStudent;
    }

}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/"));
app.listen(3000, function () {
    console.log('Server started, Hello Hoderiko :)');
});
app.use(session({
    secret: 'R2W4BNGUGRLH8V0WTN3URVPNLBDKBR2DD4DB5ELDV8CCTADD5X01JDZBH0BXTJ9I',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/HTML/index.html');
});

app.get('/loginHub', function (req, res) {
    res.sendFile(__dirname + '/HTML/role.html');
});

// Admin Tabs.

app.get('/adminLogIn', function (req, res) {
    res.sendFile(__dirname + '/HTML/adminLogIn.html');
});

app.get('/adminDashboard', isAuthenticatedAdmin(), isRole(ADMIN), function (req, res) {
    res.sendFile(__dirname + '/HTML/adminDashboard.html');
});

app.get('/Modules', isAuthenticatedAdmin(), isRole(ADMIN), function (req, res) {
    res.sendFile(__dirname + '/HTML/adminModules.html');
});

app.get('/Students', isAuthenticatedAdmin(), isRole(ADMIN), function (req, res) {
    res.sendFile(__dirname + '/HTML/studentsTab.html');
});

app.get('/Teachers', isAuthenticatedAdmin(), isRole(ADMIN), function (req, res) {
    res.sendFile(__dirname + '/HTML/teacherTab.html');
});

// Teacher Tabs.

app.get('/teacherLogIn', function (req, res) {
    res.sendFile(__dirname + '/HTML/teacherLogIn.html');
});

app.get('/teacherDashboard', isAuthenticatedTeacher(), isRole(TEACHER), function (req, res) {
    res.sendFile(__dirname + '/HTML/teacherDashboard.html');
});

app.get('/teacherModules', isAuthenticatedTeacher(), isRole(TEACHER), function (req, res) {
    res.sendFile(__dirname + '/HTML/teacherModules.html');
});

app.get('/teacherStudentGrades', isAuthenticatedTeacher(), isRole(TEACHER), function (req, res) {
    res.sendFile(__dirname + '/HTML/teacherStudentGrades.html');
});

app.get('/teacherExams', isAuthenticatedTeacher(), isRole(TEACHER), function (req, res) {
    res.sendFile(__dirname + '/HTML/teacherExams.html');
});

app.get('/teacherUpcomingClasses', isAuthenticatedTeacher(), isRole(TEACHER), function (req, res) {
    res.sendFile(__dirname + '/HTML/teacherUpcomingClasses.html');
});

app.get('/QRCode', isAuthenticatedTeacher(), isRole(TEACHER), function (req, res) {
    res.sendFile(__dirname + '/HTML/classQRCode.html');
});

// Student Tab.

app.get('/studentLogIn', function (req, res) {
    res.sendFile(__dirname + '/HTML/studentLogIn.html');
});

app.get('/studentDashboard', isAuthenticatedStudent(), isRole(STUDENT), function (req, res) {
    res.sendFile(__dirname + '/HTML/studentDashboard.html');
});

app.get('/studentModules', isAuthenticatedStudent(), isRole(STUDENT), function (req, res) {
    res.sendFile(__dirname + '/HTML/studentModules.html');
});

app.get('/studentGrades', isAuthenticatedStudent(), isRole(STUDENT), function (req, res) {
    res.sendFile(__dirname + '/HTML/studentGrades.html');
});

app.get('/studentExams', isAuthenticatedStudent(), isRole(STUDENT), function (req, res) {
    res.sendFile(__dirname + '/HTML/studentExams.html');
});

app.get('/modulesTab', function (req, res) {
    res.sendFile(__dirname + '/HTML/modulesTab.html');
});

app.get('/teacherTab', isAuthenticatedStudent(), isRole(ADMIN), function (req, res) {
    res.sendFile(__dirname + '/HTML/teacherTab.html');
});

app.get('/studentsTab', isAuthenticatedStudent(), isRole(ADMIN), function (req, res) {
    res.sendFile(__dirname + '/HTML/studentsTab.html');
});

app.get("/adminLogout", function (req, res) {
    req.logout();
    res.redirect("/loginHub");
    console.log("You've been logged out");
});

app.get("/teacherLogout", function (req, res) {
    req.logout();
    res.redirect("/loginHub");
    console.log("You've been logged out");
});

app.get("/studentLogout", function (req, res) {
    req.logout();
    res.redirect("/loginHub");
    console.log("You've been logged out");
});

// Modules - Upcoming Classes

app.get("/teacherUpcomingClasses", function (req, res) {
    res.sendFile(__dirname + '/HTML/teacherUpcomingClasses.html');
});



passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
    function (email, password, done) {
        const query = db.prepare(userLogIn);
        query.get(email, function (err, row) {
            if (err) { return done(err); }
            if (!row) { return done(null, false, { message: 'User not found.' }); }
            if (password == row.password) {
                done(null, { id: row.id });
                console.log(row);
                userID = row.id;
                userRole = row.role;
            }
            else {
                return done(null, false, { message: 'Incorrect password' });
            }
        });
    }
));

function isAuthenticatedAdmin() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/adminLogIn');
    }
}

function isAuthenticatedTeacher() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/teacherLogIn');
    }
}

function isAuthenticatedStudent() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/studentLogIn');
    }
}

function isRole(roleRequired) {
    return function (req, res, next) {
        if (userRole != roleRequired) {
            console.log("Incorrect Role");
            req.logout()
            return res.redirect('/loginHub');
        }
        return next();
    }
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    const query = db.prepare(findUserbyID);
    query.get(id, function (err, row) {
        done(err, row);
    });
});

app.post('/adminLogIn', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {

        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            console.log(info);
            console.log("Access Denied");
            return res.redirect('/adminLogIn');
        }
        req.logIn(user, function (err) {
            if (err) {
                console.log(err);
                return next(err);
            }
            console.log("Access Granted");
            return res.redirect('/adminDashboard');
        });
    })(req, res, next);
});

app.post('/adminDashboard', function (req, res, next) {
    const query = db.prepare(getUserAttendance);
    query.all(function (error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            for (var i = 0; i < rows.length; i++) {
                record.push({
                    Name: rows[i].name,
                    ModuleName: rows[i].mName,
                    Attended: rows[i].attended,
                    classDate: rows[i].classDate,
                    classJoinTime: rows[i].classJoinTime
                });
            }

            console.log(record);
            csvWriter.writeRecords(record)
                .then(result => console.log("worked message: ", result))
                .catch(ex => console.error(ex));

        }

        // "SELECT name, mName, attended, classDate, classJoinTime FROM userAttendedClass JOIN User on userAttendedClass

        // {id: 'Name', title: 'NAME'},
        // {id: 'ModuleName', title: 'MODULENAME'},
        // {id: 'Attended', title: 'ATTENDANCE'},
        // {id: 'classDate', title: 'CLASSDATE'},
        // {id: 'classJoinTime', title: 'CLASSJOINDATE'}
    });
});

app.post('/teacherLogIn', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {

        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            console.log(info);
            console.log("Access Denied");
            return res.redirect('/teacherLogIn');
        }
        req.logIn(user, function (err) {
            if (err) {
                console.log(err);
                return next(err);
            }
            console.log("Access Granted");
            return res.redirect('/teacherDashboard');
        });
    })(req, res, next);
});

app.post('/studentLogIn', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {

        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            console.log(info);
            console.log("Access Denied");
            return res.redirect('/studentLogIn');
        }
        req.logIn(user, function (err) {
            if (err) {
                console.log(err);
                return next(err);
            }
            console.log("Access Granted");
            return res.redirect('/studentDashboard');
        });
    })(req, res, next);
});

app.post("/studentModules", function (req, res) {
    const query = db.prepare(selectModulesByStudent);
    query.all(userID, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });

});

app.post("/studentExams", function (req, res) {
    const query = db.prepare(selectExamsByStudent);
    query.all(userID, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });

});

app.post("/studentGrades", function (req, res) {
    const query = db.prepare(selectGradesByStudent);
    query.all(userID, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });

});

app.post("/teacherModules", function (req, res) {
    const query = db.prepare(selectModulesByTeacher);
    query.all(userID, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });

});

app.post("/teacherStudentGrades", function (req, res) {
    const query = db.prepare(selectTeacherStudentGrades);
    query.all(userID, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });

});

app.post("/teacherExams", function (req, res) {
    const query = db.prepare(selectExamsByTeacher);
    query.all(userID, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });

});

app.post("/teacherUpcomingClasses", function (req, res) {
    const mID = req.body.moduleID;
    const query = db.prepare(selectUpcomingClassesByTeacher);
    query.all(userID, mID, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });

});

app.post("/Modules", function (req, res) {
    const query = db.prepare(selectAllModules);
    query.all(function (error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });

});

app.post("/Teachers", function (req, res) {
    const query = db.prepare(selectAllTeachers);
    query.all(function (error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });

});

app.post("/Students", function (req, res) {
    const query = db.prepare(selectAllStudents);
    query.all(function (error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });

});

app.post("/QRCode", function (req, res) {
    const classID = req.body.classID;
    console.log(classID);
    const query = db.prepare(selectQRCodeInfo);
    query.all(classID, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });

});
