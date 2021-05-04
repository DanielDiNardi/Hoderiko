// Sends an empty post to the server to get the character information.
function viewTeacherExams(){
    const post = $.post('http://localhost:3000/teacherExams', 0);
    console.log("Inside viewTeacherExams func");
    post.done(processRows);
    post.fail(processErrors);
    
}

// Displays Test information as a card.
function processRows(rows, status, xhr) {
    console.log("Inside processRows func");
    for (let i = 0; i < rows.length; i++) {

        var div = $(
            `<div class="card text-center " id="examCard""onmouseover="$(this).css('background-color','#c5f0d1', 'font-size', '2.5em')" onmouseleave="$(this).css('background-color','white', 'font-size', '2.5em');">
                <div class="card-body">
                    <p class="card-text">${rows[i].testName}</p>
                    <p class="card-text">${rows[i].testDate}</p>
                    <p class="card-text">${rows[i].testResult}</p>
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
viewTeacherExams();