
//Cooper Hewitt API token 
var token = "2907bb23a319de02d7174829a85eef94";

var allObjectsDataset = [];

//Random Selection of Objects
var objectsIDList = ["18556803","18669933","18189629","18562505","18345093","18670531","18503555","18670541","18804487","18475233","18384975","18710753","18343489","18431555","18189989","18386953","18189975","18630157","18622391","18384901","18464763","18464327","18638635","18801131","18488149","18630151","18631419","18631613","18710395","18407005","18643095","18480039","18706745","18648931","18479937","18397501","18704669","18636979","18612303","18624533","18678409","18451439","18397505","18447273","18646479","18635729","18644885","18684087","18649073","18490433","18398361","18407425","18637731","18638099","18637605","18388547","18643059","18653089","18617493","18451445","18444283","18400935","18410569"];

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
			lifespan: "tempLife",
			yearAcquired: "tempDate",
			hasBeenExhibited: "false",
			exhibitEnd: "null",
			exhibitStart: "null"
		};

		console.log("Processing objects");

		//AJAX request
		var request = $.get(url, function( response ) {
			var objResponse = response; // variable to hold the response
			var obj = objResponse.object;

			objData.objTitle = obj.title;	
			objData.yearEnd = obj.year_end;	//year object was finished
			objData.yearStart = obj.year_start;	//year object was started
			objData.yearAcquired = obj.year_acquired;	//year object acquired
			//var creationAge = objData.yearEnd - objData.yearStart;
			//var acquisitionAge = objData.yearAcquired - objData.yearStart;

			// object has been exhibited
			if (obj.exhibitions.length != 0) {

				objData.exhibitStart = obj.exhibitions[0].date_start.substring(0,4);

				if (obj.exhibitions[0].is_active == 1) {
					objData.exhibitEnd = 2015;
				} else {
					objData.exhibitEnd = obj.exhibitions[0].date_end.substring(0,4);
				}

				hasBeenExhibited = "true";
				objData.lifespan = objData.exhibitEnd - objData.yearStart;

			// object has never been exhibited
			} else if (obj.exhibitions.length == 0){
				objData.lifespan = objData.yearAcquired - objData.yearStart;
			}


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








