// The function gets a list of objects ('dataList' arg), each one would be a single row in the future-to-be CSV file
// The headers to the columns would be sent in an array ('headers' args). It is taken as the second arg
function dataToCSV(dataList,headers){
    var allObjects = [];
    // Pushing the headers, as the first arr in the 2-dimensional array 'allObjects' would be the first row
    allObjects.push(headers);

    //Now iterating through the list and build up an array that contains the data of every object in the list, in the same order of the headers
    dataList.forEach(function(object){
        var arr = [];
        arr.push(object.id);
        arr.push(object.term);
        arr.push(object.Date);

        // Adding the array as additional element to the 2-dimensional array. It will evantually be converted to a single row
        allObjects.push(arr)
    });

   // Initializing the output in a new variable 'csvContent'
    var csvContent = "";

    // The code below takes two-dimensional array and converts it to be strctured as CSV
    // *** It can be taken apart from the function, if all you need is to convert an array to CSV
    allObjects.forEach(function(infoArray, index){
      var dataString = infoArray.join(",");
      csvContent += index < allObjects.length ? dataString+ "\n" : dataString;
    }); 

    // Returning the CSV output
    return csvContent;
}

//this statement tells the browser what type of data is supposed to download and force it to download
res.writeHead(200, {
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; filename=*custom_name*.csv'
});
// whereas this part is in charge of telling what data should be parsed and be downloaded
res.end(dataToCSV(dataList,["ID","Name","Date"]),"binary");