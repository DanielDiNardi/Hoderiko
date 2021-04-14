const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
const { json } = require("express");

/*
relative path to login sheet 
*/
const csvFilepath = "userdata.csv";
const UserDataAsJsonArray = [];


/*DEBUG: */
let helperCounter = 0;

//Part 1 Read cvs 
let inputStream = Fs.createReadStream(csvFilepath, 'utf8');
inputStream
    .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: false, skipHeader: true, }))
    .on('data', function (row) {
        helperCounter++;
        if (helperCounter % 1000 === 0) {
            console.log("CSVPARSER:\tExample Row: ", row)
        }
        //processing: 
        AddRowToJsonArray(row)
        // if (helperCounter === 10)
        //     console.log(booksAsJsonArray);
        if (helperCounter === 922)
            console.log("CSVREADER: ", row);

    })
    .on('end', function (data) {
        console.log('CSVPARSER:\t No more rows! Done with reading file');
        console.log('CSVPARSER:\t Starting with importing');
        ImportToDatabase();
    });

//HELPER FUNCTION FOR PART1:
function AddRowToJsonArray(row) {
    UserDataAsJsonArray.push({
        userMail: row[0],
        password: row[1],
        role: row[2],
        name: row[3],
        surName: row[4], 
    })
}

//Part 3 put stuff into database from json -> call reformat/validation/hash
function ImportToDatabase() {
/* connect to database*/   
var valuesAsList = parseJsonToPostgreValuePairs(booksAsJsonArray);


}

//Part 2 reformat/validate/"do some changes"
//Part 2a) change the passwords to hashed. 

//part 4 maybe validate/check/test (in live system not unit test); 


