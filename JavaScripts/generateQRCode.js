var QRCode = require('qrcode')

function getClassData(){
	var newClassID = localStorage.getItem("newClassKey");
    const post = $.post('http://localhost:3000/QRCode', newClassID);
    post.done(processRows);
    post.fail(processErrors);
}

// Displays character information as a button.
function processRows(rows, status, xhr) {
    console.log("Inside processRows func");

	var data = rows;

	QRCode.makeCode(data);
}

// Returns an error in console if a field is invalid.
function processErrors() {
    console.log('Validation errors');
}

$("#getQRCode").onclick(function(){
	getClassData();
});

function classIDFunction(classID) {
    var newClassID = classID;
    localStorage.setItem("newClassKey", newClassID);

    location.href = "/QRCode";    
}