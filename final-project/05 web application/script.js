
//Cooper Hewitt API token 
var token = "2907bb23a319de02d7174829a85eef94";

var allObjectsDataset = [];

//Random Selection of Objects
var objectsIDList = [
			"18707303", "18700327","18700329","18700427","18700463","18700465","18700487","18702279","18702283","18702573","18705893","18707303","35520811","35520817","51497205","51497673","52027699","68862903","18702819","18729905","18732835","18732295","68862901","35520793"];

//run after function with callback function and length of object array
var done = after(makeGraph, objectsIDList.length);

for (i = 0; i < objectsIDList.length; i++) {

	(function (i) {
	//get info about a specific object method - returns JSON
	var url ='https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.getInfo&access_token=' + token + '&object_id=' + objectsIDList[i] +"&extras=exhibitions";

	// create an javascript obj for each object instance in collection
	var objData = { 
		objTitle: "tempTitle",
		objYearStart:"tempDate", 
		objYearEnd: "tempDate", 
		//objDate: "tempDate",
		objAcquired: "tempDate",
		objExhibits: "tempExhibit"
	};

	//AJAX request
	var request = $.get(url, function( response ) {
		var objResponse = response; // variable to hold the response
		var obj = objResponse.object;

		//console.log("Processing " + obj.title);

		objData.objTitle = obj.title;	
		objData.objYearEnd = obj.year_end;	//year object was finished
		objData.objYearStart = obj.year_start;	//year object was started
		//objData.objDate = obj.date.substring(0,4);
		objData.objAcquired = obj.year_acquired;	//year object acquired
		objData.objExhibits = obj.exhibitions[0];

		allObjectsDataset.push(objData); // add object to full dataset

		// invoke done function to see if all objects have been processed
		done();

		//var creationAge = objYearEnd - objYearStart;
		//var acquisitionAge = objAcquired - objYearStart;
		
		/*//var $msg = "<p>" + objTitle + ", created in " + objDate + ", was aquired by the Cooper Hewitt in " + objAcquired + ".</p>";
		var $msg = "<h3>" + objTitle + "</h3><br><p>Created in " + objYearStart + " - " + objYearEnd + "<br>Acquired in " + objAcquired + "<br>Creation Lifespan: " + creationAge + "<br>Acquision Lifespan: " + acquisitionAge;
		$('#test').after($msg);*/
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








