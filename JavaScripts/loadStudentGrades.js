// Sends an empty post to the server to get the character information.
function viewStudentGrades(){
    const post = $.post('http://localhost:3000/studentGrades', 0);
    console.log("Inside viewStudentGrades func");
    post.done(processRows);
    post.fail(processErrors);
    
}

// Displays Grades information as a card.
function processRows(rows, status, xhr) {
    console.log("Inside processRows func");
    for (let i = 0; i < rows.length; i++) {

        var div = $(
            `<div class="card text-center " id="gradeCard"">
                <div class="card-body">
                    <p class="card-text">${rows[i].mName}</p>
                    <p class="card-text">${rows[i].finalGrade}</p>
                </div>
            </div>`);

        $(div).appendTo("#listHeader");
    }
}

// Returns an error in console if a field is invalid.
function processErrors() {
    console.log('Validation errors');
}

// Calls viewChar function when the page opens.
viewStudentGrades();