// Sends an empty post to the server to get the character information.
function viewAdminModules(){
    var newMID = localStorage.getItem("newMKey");
    const post = $.post('/teacherUpcomingClasses', {moduleID: newMID});
    console.log("Inside viewAdminModules func");
    post.done(processRows);
    post.fail(processErrors);
    
}

// Displays character information as a button.
function processRows(rows, status, xhr) {
    console.log("Inside processRows func");
    for (let i = 0; i < rows.length; i++) {

        var div = $(
            `<div class="card text-center " id="moduleCard" onclick = "classIDFunction('${(rows[i].classID)}')" onmouseover="$(this).css('background-color','#c5f0d1', 'font-size', '2.5em')" onmouseleave="$(this).css('background-color','white', 'font-size', '2.5em');">
                <div class="card-body">
                    <p class="card-text">${rows[i].mName}</p>
                    <p class="card-text">${rows[i].classDate}</p>
                    <p class="card-text">${rows[i].classStartTime} - ${rows[i].classEndTime}</p>
                </div>
            </div>`);
        $(div).appendTo("#listHeader");
    }
}

// Returns an error in console if a field is invalid.
function processErrors() {
    console.log('Validation errors');
}

function mIDFunction(mID){
    var newMID = mID;
    localStorage.setItem("newMKey", newMID);

    location.href = "/teacherUpcomingClasses";
}