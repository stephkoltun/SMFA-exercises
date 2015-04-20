
//Cooper Hewitt API token 
var token = "2907bb23a319de02d7174829a85eef94";

var allObjectsDataset = [];

//Random Selection of Objects
var objectsIDList = [18556803,
18669933,
18189629,
18562505,
18345093,
18670531,
18503555,
18670541,
18804487,
18475233,
18384975,
18710753,
18343489,
18431555,
18189989,
18386953,
18189975,
18630157,
18622391,
18384901,
18464763,
18464327,
18638635,
18801131,
18488149,
18630151,
18631419,
18631613,
18710395,
18407005,
18643095,
18480039,
18706745,
18648931,
18479937,
18397501,
18704669,
18636979,
18612303,
18624533,
18678409,
18451439,
18397505,
18447273,
18646479,
18635729,
18644885,
18684087,
18649073,
18490433,
18398361,
18407425,
18637731,
18638099,
18637605,
18388547,
18643059,
18653089,
18617493,
18451445,
18444283,
18400935,
18410569,
18636321,
18420439,
18636407,
18430869,
18478757,
18648915,
18621871,
18617539,
18710419,
18732757,
18615581,
18618197,
18637287,
18498241,
18498103,
18632197,
18637367,
18643637,
18732295,
68243989,
18805581,
18621779,
18733539,
18705525,
18705523,
18639709,
18733541,
18638839,
18647243,
18712511,
18756025,
18655795,
18690599,
18713685,
18710261,
18714235,
68267959,
18707305,
18700467,
18707303,
18701169,
18714667,
18710577,
18705947,
18710253,
18710251,
18729965,
18732835,
18731347,
68515679,
18716171,
18731063,
18757383,
18731245,
18788349,
68268333,
51497205];

//run after function with callback function and length of object array
var done = after(makeGraph, objectsIDList.length);

for (i = 0; i < objectsIDList.length; i++) {

	(function (i) {
		//get info about a specific object method - returns JSON
		var url ='https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.getInfo&access_token=' + token + '&object_id=' + objectsIDList[i] +"&extras=exhibitions";

		// create an javascript obj for each object instance in collection
		var objData = { 
			key: i,
			objTitle: "tempobjTitle",
			yearStart:"tempDate", 
			yearEnd: "tempDate", 
			lifespan: "tempLife",
			yearAcquired: "tempDate",
			hasBeenExhibited: false,
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


			// NOTE TO SELF: DEAL WITH MULTIPLE EXHIBITS!!!
			// object has been exhibited
			if (obj.exhibitions.length != 0) {

				hasBeenExhibited = true;

				objData.exhibitStart = obj.exhibitions[0].date_start.substring(0,4);

				if (obj.exhibitions[0].is_active == 1) {
					objData.exhibitEnd = 2015;
				} else {
					objData.exhibitEnd = obj.exhibitions[0].date_end.substring(0,4);
				}
				
				objData.lifespan = objData.exhibitEnd - objData.yearStart;

			// object has never been exhibited
			} else if (obj.exhibitions.length == 0){
				objData.lifespan = objData.yearAcquired - objData.yearStart;
			}

			if (objData.yearStart != null && obj.exhibitions.length != 0) {
				allObjectsDataset.push(objData); // add object to full dataset
			}

			

			// invoke done function to see if all objects have been processed
			done();
		}); //End AJAX request
	})(i);
}


function makeGraph() {
	var margin = {top: 30, right: 20, bottom: 30, left: 50},
    	width = 1000 - margin.left - margin.right,
    	height = 600 - margin.top - margin.bottom;


	var data = allObjectsDataset; //global variable
	console.log(data);

	var key = function(d) {
	    return d.key;
	};

	// Parse the date
	var format = d3.time.format("%Y"),
		mindate = format.parse("1800"),
		maxdate = format.parse("2050");




	/* 
	 * value accessor - returns the value to encode for a given data object.
	 * scale - maps value to a visual display encoding, such as a pixel position.
	 * map function - maps from data value to display value
	 * axis - sets up axis
	 */

	var x = d3.time.scale()
			.range([0, width]) // value -> display
			.domain([mindate, maxdate]);

	var y = d3.scale.linear()
			.range([height, 0])
			.domain([0, 50]);


	// setup x - year acquired
	var xYearStart = function(d) { return format.parse((d.yearStart).toString());}, // convert number year to string, and format for d3
	    xYearStartMap = function(d) { return x(xYearStart(d));}; // data -> display

	var xYearEnd = function(d) { return format.parse((d.End).toString());}, // data -> value
	    xYearEndMap = function(d) { return x(xYearEnd(d));}; // data -> display

	var xYearAcquired = function(d) { return format.parse(d.yearAcquired);},
		xYearAcquiredMap = function(d) { return x(xYearAcquired(d));}; // data -> display

		//check if exhibition dates are numbers or strings
	var xExhibitEnd = function(d) { if (isNaN(d.exhibitEnd)) {
				return format.parse(d.exhibitEnd);
			} else {
				return format.parse((d.exhibitEnd).toString());
			}},
		xExhibitEndMap = function(d) { return x(xExhibitEnd(d));}; // data -> display




	

	/*// AXES
	var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(50);
	var yAxis = d3.svg.axis().scale(y).orient("left").ticks(50);*/


	console.log("Set up SVG");

	// create SVG
	var svg = d3.select("#graph")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);


	/*console.log("Add axes");
	//Created AXES
	svg.append("g")
		.attr("class","axis")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class","axis")
		.attr("transform", "translate(" + margin.right + "," + margin.bottom + ")")
		.call(yAxis);*/



	// add data!
	var objects = svg.selectAll("g.object") //select all <g> w/class "object" that <svg> children (empty)
		.data(allObjectsDataset) // join the selection to a data array
		.enter() // create a selection for the data objects that didn't match elements
		.append("g") // add a new <g> for each data object
		.attr("class","object"); // set the <g>'s class to match previous selection criteria
		//.attr("transform", function(d,i) {
				//return "translate(" + xScale(i) + "," + yScale(i) + ")";})

	//for each object group, add a path element and then a sub selection for circles
	var lines = objects.append("line") // add a <path> within each object <g>, inherits data from <g>
		.attr("class","lines") // set class for CSS styling
		.attr("x1", xYearStartMap)
		.attr("y1", function (d,i) { return (height - (i*3));})
		.attr("x2", xExhibitEndMap)
		.attr("y2", function (d,i) { return (height - (i*3));})
		.style("stroke", "black");


} // end of graphing function

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








