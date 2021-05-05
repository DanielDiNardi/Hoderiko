const assert = require('chai').assert;
const app = require('../app');

describe('Database Query Check', function() {

		it('Check userLogIn', function() {
			let query = app.userLogInCheck();
			assert.equal(query, 'SELECT id, email, password, role FROM User WHERE email = $1;');
		})

		it('Check findUserbyID', function() {
			let query = app.findUserbyIDCheck();
			assert.equal(query, 'SELECT id FROM User WHERE id = $1;');
		})

		it('Check selectModulesByStudent', function() {
			let query = app.selectModulesByStudentCheck();
			assert.equal(query, 'SELECT mName, mID FROM Course JOIN Module USING(mID) WHERE sID = $1;');
		})

		it('Check selectExamsByStudent', function() {
			let query = app.selectExamsByStudentCheck();
			assert.equal(query, 'SELECT testName, testDate, testResult FROM Test WHERE sID = $1;');
		})

		it('Check selectGradesByStudent', function() {
			let query = app.selectGradesByStudentCheck();
			assert.equal(query, 'SELECT mName, finalGrade FROM Grade JOIN Module USING(mID) WHERE sID = $1;');
		})






		

		it('Check selectModulesByTeacher', function() {
			let query = app.selectModulesByTeacherCheck();
			assert.equal(query, 'SELECT mName, mID FROM Module WHERE tID = $1;');
		})

		it('Check selectTeacherStudentGrades', function() {
			let query = app.selectTeacherStudentGradesCheck();
			assert.equal(query, 'SELECT name, mName, finalGrade FROM Grade JOIN Module USING(mID) JOIN user on(grade.sId = user.id) WHERE tID = $1;');
		})

		it('Check selectExamsByTeacher', function() {
			let query = app.selectExamsByTeacherCheck();
			assert.equal(query, 'SELECT testName, testDate, testResult FROM Test JOIN module USING(mID) WHERE tID = $1;');
		})

		it('Check selectAllModules', function() {
			let query = app.selectAllModulesCheck();
			assert.equal(query, 'SELECT * FROM Module;');
		})

		it('Check selectAllStudents', function() {
			let query = app.selectAllStudentsCheck();
			assert.equal(query, "SELECT * FROM User WHERE role = 'ROLE.STUDENT';");
		})

		it('Check selectAllTeachers', function() {
			let query = app.selectAllTeachersCheck();
			assert.equal(query, "SELECT * FROM User WHERE role = 'ROLE.TEACHER';");
		})

		it('Check confirmAttendanceToBeDone', function() {
			let query = app.confirmAttendanceToBeDoneCheck();
			assert.equal(query, "INSERT INTO userAttendedClass(sID, classID, classJoinTime, serverJoinTime, attended) \
    VALUES($1, $2, date($3,'unixepoch'), date('now'), true);");
		})

		it('Check selectUpcomingClassesByTeacher', function() {
			let query = app.selectUpcomingClassesByTeacherCheck();
			assert.equal(query, 'SELECT classID, mName, classDate, classStartTIme, classEndTime FROM module JOIN class USING(mID) WHERE tID = $1 AND mID = $2;');
		})

		it('Check selectQRCodeInfo', function() {
			let query = app.selectQRCodeInfoCheck();
			assert.equal(query, 'SELECT * FROM Class WHERE classID = $1;');
		})

		it('Check getUserAttendance', function() {
			let query = app.getUserAttendanceCheck();
			assert.equal(query, 'SELECT name, mName, attended, classDate, classJoinTime FROM userAttendedClass JOIN User on userAttendedClass.sID = User.id JOIN Class USING(classID) JOIN Module USING(mID);');
		})

})