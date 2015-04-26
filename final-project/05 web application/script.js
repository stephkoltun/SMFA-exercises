
//Cooper Hewitt API token 
var token = "2907bb23a319de02d7174829a85eef94";

var allObjectsDataset = [];

//Random Selection of Objects
var objectsIDList = [
18669933,18189629,18562505,18345093,18670531,18503555,18670541,18804487,
18475233,18384975,18710753,18343489,18431555,18189989,18386953,18189975,
18630157,18622391,18384901,18464763,18464327,18638635,18801131,18488149,
18630151,18631419,18631613,18710395,18407005,18643095,18480039,18706745,
18648931,18479937,18397501,18704669,18636979,18612303,18624533,18678409,
18451439,18397505,18447273,18646479,18635729,18644885,18684087,18649073,
18490433,18398361,18407425,18637731,18638099,18637605,18388547,18643059,
18653089,18617493,18451445,18444283,18400935,18410569,18636321,18420439,
18636407,18430869,18478757,18648915,18621871,18617539,18710419,18732757,
18615581,18618197,18637287,18498241,18498103,18632197,18637367,18643637,
18732295,68243989,18805581,18621779,18733539,18705525,18705523,18639709,
18733541,18638839,18647243,18712511,18756025,18655795,18690599,18713685,
18710261,18714235,68267959,18707305,18700467,18707303,18701169,18714667,
18710577,18705947,18710253,18710251,18729965,18732835,18731347,68515679,
18716171,18731063,18757383,18731245,18788349,68268333,51497205,18556803];

//run after function with callback function and length of object array
var done = after(makeGraph, objectsIDList.length);

for (i = 0; i < objectsIDList.length; i++) {

	(function (i) {
		//get info about a specific object method - returns JSON
		var url ='https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.getInfo&access_token=' + token + '&object_id=' + objectsIDList[i] +"&extras=exhibitions";


		//I THINK I CAN REWRITE THIS WITHOUT MAKING A NEW OBJECT.
		//JUST USE A BUNCH OF IF STATEMENTS TO CHECK YEAR DATA
		//ONLY ADD COMPLETE OBJECTS TO SET.
		//MAY HELP DECREASE PROCESSING TIME

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

		//console.log("Processing objects");

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
			if (obj.exhibitions.length != 0) { // object has been exhibited
				hasBeenExhibited = true;
				objData.lifespan = objData.exhibitEnd - objData.yearStart;
				objData.exhibitStart = obj.exhibitions[0].date_start.substring(0,4);
				if (obj.exhibitions[0].is_active == 1) {
					objData.exhibitEnd = 2015;
				} else {
					objData.exhibitEnd = obj.exhibitions[0].date_end.substring(0,4);
				}
			} else if (obj.exhibitions.length == 0){ // object has never been exhibited
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


	/* ------ SET UP VARIABLES AND DATA FUNCTIONS ------ */

	var margin = {top: 30, right: 20, bottom: 30, left: 50},
    	width = $(window).width() - margin.left - margin.right - 210,
    	height = 1700 - margin.top - margin.bottom,
    	padding = allObjectsDataset.length * 1.35;

	// Parse the date
	var format = d3.time.format("%Y"),
		mindate = format.parse("1880"),
		maxdate = format.parse("2020");


	// Set up scale functions
	var x = d3.time.scale()
			.range([0, width]) // value -> display
			.domain([mindate, maxdate]);

	var y = d3.scale.linear()
			.range([height, 0])
			.domain([0, allObjectsDataset.length]);


	// Scale and map date value functions
	// convert number year to string, and format for d3
	var xYearStart = function(d) { return format.parse((d.yearStart).toString());}, 
	    xYearStartMap = function(d) { return x(xYearStart(d));}; // data -> display

	var xYearEnd = function(d) { return format.parse((d.yearEnd).toString());}, // data -> value
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
	var xExhibitStart = function(d) { if (isNaN(d.exhibitStart)) {
				return format.parse(d.exhibitStart);
			} else {
				return format.parse((d.exhibitStart).toString());
			}},
		xExhibitStartMap = function(d) { return x(xExhibitStart(d));}; // data -> display


	// Define axes
	var xAxis = d3.svg.axis().scale(x).orient("top").ticks(15).tickSize(8);
	var xSubAxis = d3.svg.axis().scale(x).orient("top").ticks(150).tickSize(3);




	/* ------ MAKE THE GRAPH ------ */


	// create SVG
	var svg = d3.select("#graph")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top*2 + margin.bottom);

	var svgAxes = d3.select("#graphAxes")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", 70);

	//Created AXES
	svgAxes.append("g")
		.attr("class","subaxis")
		.attr("transform", "translate(" + margin.left + ",40)")
		.call(xSubAxis);
	svgAxes.append("g")
		.attr("class","axis")
		.attr("transform", "translate(" + margin.left + ",40)")
		.call(xAxis);

	


	// DEFINE GROUPS FOR EACH OBJECT
	var objects = svg.selectAll("g.object") //select all <g> w/class "object" in <svg> (empty)
		.data(allObjectsDataset) // join the selection to a data array
		.enter() // create a selection for the data objects that didn't match elements (all)
		.append("g") // add a new <g> for each data object
		.attr("class","object") // set the <g>'s class to match selection criteria
		.attr("transform", function(d,i) {
				return "translate(" + margin.left + "," + (y(i*1.15)+margin.top) + ")";});

	// ADD LINES AND CIRCLES within each object <g>, inherits data from <g>

	// add "invisible" shape for mouseover trigger
	var trigger = objects.append("line")
		.attr("class","obj-trigger")
		.attr("x1", xYearStartMap)
		.attr("y1", "0")
		.attr("x2", xExhibitEndMap)
		.attr("y2", "0");

	var lines = objects.append("line") //overall connection line for each obj
		.attr("class","lines") // set class for CSS styling
		.attr("x1", xYearStartMap)
		.attr("y1", "0")
		.attr("x2", xExhibitEndMap)
		.attr("y2", "0");

	var createdMarker = objects.append("line") //years created
		.attr("class","created") 
		.attr("x1", xYearStartMap)
		.attr("y1", "0")
		.attr("x2", xYearEndMap)
		.attr("y2", "0");

	var exhibitedMarker = objects.append("line") //years exhibited
		.attr("class","exhibited") 
		.attr("x1", xExhibitStartMap)
		.attr("y1", "0")
		.attr("x2", xExhibitEndMap)
		.attr("y2", "0");

	var acquiredMarker = objects.append("circle") //year acquired
		.attr("class","acquired")
		.attr("cx", xYearAcquiredMap)
		.attr("cy", "0")
		.attr("r","2.5px");

	




	/* ------ SORTING FUNCTIONS ------ */

	var resortAcquire = d3.select("#sortAcquired")
		.on("click", function() {
			console.log("resorting by year acquired");
			objects.sort(function(a, b) {
				return d3.ascending(a.yearAcquired, b.yearAcquired);
			})
			.transition()
			.duration(1000)
	    	.attr("transform", function(d,i) { 
	    		return "translate(" + margin.left + "," + (y(i*1.15)+margin.top) + ")";
	    	});
    	});

    var resortCreated = d3.select("#sortCreated")
		.on("click", function() {
			console.log("resorting by year created");
			objects.sort(function(a, b) {
				return d3.ascending(a.yearStart, b.yearStart);
			})
			.transition()
			.duration(1000)
	    	.attr("transform", function(d,i) { 
	    		return "translate(" + margin.left + "," + (y(i*1.15)+margin.top) + ")";
	    	});
    	});

	var resortExhibited = d3.select("#sortExhibited")
		.on("click", function() {
			console.log("resorting by year exhibited");
			objects.sort(function(a, b) {
				return d3.ascending(a.exhibitStart, b.exhibitStart);
			})
			.transition()
			.duration(1000)
	    	.attr("transform", function(d,i) { 
	    		return "translate(" + margin.left + "," + (y(i*1.15)+margin.top) + ")";
	    	});
    	});

/*	var resortLifespan = d3.select("#sortLifespan")
		.on("click", function() {
			console.log("resorting by object's lifespan");
			objects.sort(function(a, b) {
				return d3.ascending(a.lifespan, b.lifespan);
			})
			.transition()
			.duration(1000)
	    	.attr("transform", function(d,i) { 
	    		return "translate(" + margin.left + "," + (y(i)+margin.top) + ")";
	    	});
    	});*/



    /* ------ MOUSEOVER EVENTS FOR SELECTED OBJECT ------ */

    d3.selectAll("g").on("mouseover", function(d) {

    	//fade all objects
    	d3.selectAll('.object')
    	.transition()
    	.duration(250)
    	.style('opacity','0.3');

    	//don't fade selected object
    	d3.select(this).selectAll('.object')
    	.transition()
    	.duration(250)
    	.style('opacity','1');

    	//background highlight for selected object
    	d3.select(this).selectAll('.obj-trigger')
    	.transition()
    	.duration(250)
    	.style("stroke-opacity","1.0");




    	//     HIGHLIGHT RELATED OBJECTS     //

    	// set up variables for the moused-over data
    	var selectedYearAcquired = d.yearAcquired; // year to compare with
    	var selectedYearStarted = d.yearStart; // year to compare with
    	var selectedYearExhibited = d.exhibitStart; // year to compare with
    	
    	// filter object selection to match mouseover object years
		var objMatchYearAcquired = d3.selectAll('.object').filter(function(d) {
			return d.yearAcquired == selectedYearAcquired;
		})
			.transition()
			.style('opacity','1');

		d3.selectAll('.object').filter(function(d) {
			return d.yearStart == selectedYearStarted;
		})
			.transition()
			.style('opacity','1');

		d3.selectAll('.object').filter(function(d) {
			return d.exhibitStart == selectedYearExhibited;
		})
			.transition()
			.style('opacity','1');




		//     DRAW LINES BETWEEN RELATED OBJECTS     //
/*
		objMatchYearAcquired.each(function(d, i) {

			console.log(this);
			//var yPosition = parseFloat(d3.select('circle').attr("cy"));
			//console.log(yPosition);

			svg.append("line") 
			.attr("class","acquiredLine")
			.attr("x1", x(format.parse(selectedYearAcquired)))
			.attr("y1", yPosition)
			.attr("x2", x(format.parse(selectedYearAcquired)))
			.attr("y2", "0")
			.attr("transform", "translate(" + margin.left + ", 0)");
		});*/




/*
		svg.append("line") 
		.attr("class","acquiredLine")
		.attr("x1", x(format.parse(selectedYearAcquired)))
		.attr("y1", "0")
		.attr("x2", x(format.parse(selectedYearAcquired)))
		.attr("y2", "1400")
		.attr("transform", "translate(" + margin.left + ", 0)");*/


		svg.append("line") 
		.attr("id","exhibitedLine")
		.attr("x1", x(format.parse(selectedYearExhibited)))
		.attr("y1", "0")
		.attr("x2", x(format.parse(selectedYearExhibited)))
		.attr("y2", "1400")
		.attr("transform", "translate(" + margin.left + ", 0)");








    	//     YEAR LABELS     //

    	var currentObject = d3.select(this);

    	//Created Marker Positions
    	var xPositionStart = parseFloat(d3.select(this).selectAll('.created').attr("x1"));
    	var xPositionEnd = parseFloat(d3.select(this).selectAll('.created').attr("x2"));
    	var xPositionMiddle = (xPositionStart + (xPositionEnd-xPositionStart))
    	var yPositionCreated = parseFloat(d3.select(this).selectAll('.created').attr("y1")) - 8;

    	// if created spans single year
    	if (xPositionStart === xPositionEnd) {
    		currentObject.append("text")
    		.attr("class", "tooltip")
    		.attr("x", xPositionStart)
    		.attr("y", yPositionCreated)
    		.text(d.yearStart);
    	}
		// if created spans less than 5 years
    	else if ((d.yearEnd - d.yearStart) <= 5) {
    		currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xPositionMiddle)
	    		.attr("y", yPositionCreated)
	    		.text(d.yearStart + " - " + d.yearEnd);
    	}
    	// if created spans more than 5 years
    	if ((d.yearEnd - d.yearStart) > 5) {
    		currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xPositionStart)
	    		.attr("y", yPositionCreated)
	    		.text(d.yearStart);

	    		currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xPositionEnd)
	    		.attr("y", yPositionCreated)
	    		.text(d.yearEnd);
    	}

    	//Acquired Marker Positions
    	var xPositionAcquired = parseFloat(d3.select(this).selectAll('g > circle').attr("cx"));
    	var yPositionAcquired = parseFloat(d3.select(this).selectAll('g > circle').attr("cy")) - 8;

    	// only show year if not already shown
    	if (d.yearEnd != d.yearAcquired || d.yearStart != d.yearAcquired) {
	    	currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xPositionAcquired)
	    		.attr("y", yPositionAcquired)
	    		.text(d.yearAcquired);
    	}


    	//Exhibited Marker Positions
    	var xExhibitedStart = parseFloat(d3.select(this).selectAll('.exhibited').attr("x1"));
    	var xExhibitedEnd = parseFloat(d3.select(this).selectAll('.exhibited').attr("x2"));
    	var xExhibitedMiddle = (xExhibitedStart + (xExhibitedEnd-xExhibitedStart));
    	var yPositionExhibited = parseFloat(d3.select(this).selectAll('.exhibited').attr("y1")) - 8;

    	// if exhibit spans single year
    	if (xExhibitedStart === xExhibitedEnd) {
    		currentObject.append("text")
    		.attr("class", "tooltip")
    		.attr("x", xExhibitedStart)
    		.attr("y", yPositionExhibited)
    		.text(d.exhibitStart);
    	}
		// if exhibit spans less than 5 years
    	else if ((d.exhibitStart- d.exhibitEnd) <= 5) {
    		currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xExhibitedMiddle)
	    		.attr("y", yPositionExhibited)
	    		.text(d.exhibitStart + " - " + d.exhibitEnd);
    	}
    	// if exhibit spans more than 5 years
    	if ((d.exhibitEnd - d.exhibitStart) > 5) {
    		currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xExhibitedStart)
	    		.attr("y", yPositionExhibited)
	    		.text(d.exhibitStart);

	    		currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xExhibitedEnd)
	    		.attr("y", yPositionExhibited)
	    		.text(d.exhibitEnd);
    	}


    }); //end mouse over


    d3.selectAll("g").on("mouseout", function(d) {
		d3.selectAll('.object')
		.transition()
		.duration(250)
    	.style('opacity','1');

    	d3.select(this).selectAll('.obj-trigger')
    	.transition()
    	.duration(250)
    	.style("stroke-opacity","0.0");

    	d3.select(this).selectAll(".tooltip").remove();

    	//d3.select("#acquiredLine").remove();
    	d3.select("#exhibitedLine").remove();


    });





}; // end of graphing function




// AFTER LOOPING THROUGH ID LIST AND COMPLETING AJAX REQUESTS...
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








