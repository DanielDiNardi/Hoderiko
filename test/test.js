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

		it('Check selectModulesByStudentCheck', function() {
			let query = app.selectModulesByStudentCheck();
			assert.equal(query, 'SELECT mName, mID FROM Course JOIN Module USING(mID) WHERE sID = $1;');
		})

})