function isAuthenticatedAdmin() {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/adminLogIn');
    }
}

function isAuthenticatedTeacher() {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/teacherLogIn');
    }
}

function isAuthenticatedStudent() {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/studentLogIn');
    }
}

function isRole(role) {
    return function(req, res, next) {
        console.log(user);
        console.log(req.user.role + " " + role);
        if(req.user.role != role){
            console.log("Incorrect Role");
            return res.redirect('/loginHub');
        }
        return next();
    }
}

module.exports = {
    isAuthenticatedAdmin,
    isAuthenticatedTeacher,
    isAuthenticatedStudent,
    isRole
}