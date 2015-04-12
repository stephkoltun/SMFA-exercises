
//Cooper Hewitt API token 
var token = "2907bb23a319de02d7174829a85eef94";

var allObjectsDataset = [];

//Random Selection of Objects
var objectsIDList = [
			"18707303","51497205","18732835","18732295","18690599","18678409","18648915","18635729","18643637","18475233","18615581","18638635","18697321","18621779","18498241","18801131","18698907"];

//run after function with callback function and length of object array
var done = after(makeGraph, objectsIDList.length);

for (i = 0; i < objectsIDList.length; i++) {

	(function (i) {
		//get info about a specific object method - returns JSON
		var url ='https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.getInfo&access_token=' + token + '&object_id=' + objectsIDList[i] +"&extras=exhibitions";

		// create an javascript obj for each object instance in collection
		var objData = { 
			objTitle: "tempobjTitle",
			yearStart:"tempDate", 
			yearEnd: "tempDate", 
			//objDate: "tempDate",
			yearAcquired: "tempDate",
			objExhibits: "tempExhibit"
		};

		//AJAX request
		var request = $.get(url, function( response ) {
			var objResponse = response; // variable to hold the response
			var obj = objResponse.object;

			//console.log("Processing " + obj.objTitle);

			objData.objTitle = obj.title;	
			objData.yearEnd = obj.year_end;	//year object was finished
			objData.yearStart = obj.year_start;	//year object was started
			//objData.objDate = obj.date;
			objData.yearAcquired = obj.year_acquired;	//year object acquired
			objData.objExhibits = obj.exhibitions[0];
			//var creationAge = yearEnd - yearStart;
			//var acquisitionAge = yearAcquired - yearStart;

			allObjectsDataset.push(objData); // add object to full dataset

			// invoke done function to see if all objects have been processed
			done();
		}); //End AJAX request
	})(i);
}


function makeGraph() {
	var width = 800;
	var height = 600;
	var padding = 55;

	// create SVG
	var svg = d3.select("#graph")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

	var data = allObjectsDataset; //global variable
	console.log(data);
}

// check if all data has been looped through and returned from API
// checks if counter is equal to the length of objects being looped through
function after(callback, count){
	var counter = 0;
	return function(){
		if(++counter === count) {
			counter = 0;
			callback();
		}
	};
}








