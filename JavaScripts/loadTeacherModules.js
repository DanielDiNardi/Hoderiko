// Sends an empty post to the server to get the character information.
function viewTeacherModules(){
    const post = $.post('http://localhost:3000/teacherModules', 0);
    console.log("Inside viewTeacherModules func");
    post.done(processRows);
    post.fail(processErrors);
    
}

// Displays character information as a button.
function processRows(rows, status, xhr) {
    console.log("Inside processRows func");
    for (let i = 0; i < rows.length; i++) {


        var div = $(
            `<div class="card text-center " id="moduleCard" <a onclick="location.href='/teacherUpcomingClasses'">  </a> >
                <div class="card-body">
                    <p class="card-text">${rows[i].mName} </a></p>
                    <p class="card-text">${rows[i].mID}</p>
                </div>
            </div>`);

        var div2 = $(
            `<div class="card text-center " id="moduleCard"">
                <div class="card-body">
                    <p class="card-text">${rows[i].mName}</p>
                    <p class="card-text">${rows[i].mID}</p>
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
viewTeacherModules();