
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




/* ------ CREATE OBJECT FOR EACH ITEM IN COLLECTION ------ */


for (i = 0; i < objectsIDList.length; i++) {

	(function (i) {
		
		/* ------ DEFINE COLLECTION OBJECT ------ */
		var objData = { 
			key: i,
			objTitle: "tempobjTitle",
			yearStart:"tempDate", 
			yearEnd: "tempDate", 
			lifespan: "tempLife",
			yearAcquired: "tempDate",
			hasBeenExhibited: false,
			exhibitEnd: "null",
			exhibitStart: "null",
			exhibitTitle: "null",
			imageURL: "null",
			imageSQ: "null",
			designer: "Jane Smith",
			objDescription: "null"
		};
 
		



		/* ------ AJAX REQUEST - returns JSON ------ */

		var url ='https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.getInfo&access_token=' + token + '&object_id=' + objectsIDList[i] +"&extras=exhibitions";

		var request = $.get(url, function( response ) {
			var objResponse = response; // variable to hold the response
			var obj = objResponse.object;

			objData.objTitle = obj.title;
			objData.objDescription = obj.description;

			

			// assign image url value
			if (obj.images != 0) {
				objData.imageURL = obj.images[0].z.url;
				objData.imageSQ = obj.images[0].sq.url;
			} else {
				console.log(obj.id + " has no images.");
			}

			// assign designer value
			if (obj.participants != 0) {
				var designerIndex = obj.participants.length - 1;
				objData.designer = obj.participants[designerIndex].person_name;
			} else {
				console.log (obj.id + " has no associated people.");
			}


			// assign year values
			objData.yearEnd = obj.year_end;	//year object was finished
			objData.yearStart = obj.year_start;	//year object was started
			objData.yearAcquired = obj.year_acquired;	//year object acquired


			// NOTE TO SELF: DEAL WITH MULTIPLE EXHIBITS!!!
			if (obj.exhibitions.length != 0) { // object has been exhibited
				hasBeenExhibited = true;
				objData.exhibitTitle = obj.exhibitions[0].title;
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

			// only add objects that have date values	
			if (objData.yearStart != null && obj.exhibitions.length != 0) {
				allObjectsDataset.push(objData); // add object to full dataset
			}

			
			done(); // invoke done function to check if all objs processed
		}); //End AJAX request
	})(i);
}







function makeGraph() {


	/* ------ SET UP VARIABLES AND DATA FUNCTIONS ------ */

	var margin = {top: 30, right: 20, bottom: 30, left: 50},
    	width = $(window).width() - margin.left - margin.right - 210,
    	height = 1900 - margin.top - margin.bottom,
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
				.attr("height", 50);

	//Created AXES
	svgAxes.append("g")
		.attr("class","subaxis")
		.attr("transform", "translate(" + margin.left + ",34)")
		.call(xSubAxis);
	svgAxes.append("g")
		.attr("class","axis")
		.attr("transform", "translate(" + margin.left + ",34)")
		.call(xAxis);



	// SORT DATA BY YEAR TYPES
	var sortedByAcquired = allObjectsDataset.sort(function(a, b) {
		return d3.ascending(a.yearAcquired, b.yearAcquired);
	});
	





	// DEFINE GROUPS FOR EACH OBJECT
	var objects = svg.selectAll("g.object") //select all <g> w/class "object" in <svg> (empty)
		.data(sortedByAcquired, function(d) {return d.key}) // join the selection to a data array
		.enter() // create a selection for the data objects that didn't match elements (all)
		.append("g") // add a new <g> for each data object
		.attr("class","object") // set the <g>'s class to match selection criteria
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";});



	// ADD LINES AND CIRCLES within each object <g>, inherits data from <g>

	var trigger = objects.append("line")
		.attr("class","obj-trigger")
		.attr("x1", xYearStartMap)
		.attr("y1", function(d, key) {
			return y(key);
		})
		.attr("x2", xExhibitEndMap)
		.attr("y2", function(d, key) {
			return y(key);
		});

	var lines = objects.append("line") //overall connection line for each obj
		.attr("class","lines") // set class for CSS styling
		.attr("x1", xYearStartMap)
		.attr("y1", function(d, key) {
			return y(key);
		})
		.attr("x2", xExhibitEndMap)
		.attr("y2", function(d, key) {
			return y(key);
		});

	var createdMarker = objects.append("line") //years created
		.attr("class","created") 
		.attr("x1", xYearStartMap)
		.attr("y1", function(d, key) {
			return y(key);
		})
		.attr("x2", xYearEndMap)
		.attr("y2", function(d, key) {
			return y(key);
		});

	var exhibitedMarker = objects.append("line") //years exhibited
		.attr("class","exhibited") 
		.attr("x1", xExhibitStartMap)
		.attr("y1", function(d, key) {
			return y(key);
		})
		.attr("x2", xExhibitEndMap)
		.attr("y2", function(d, key) {
			return y(key);
		});

	var acquiredMarker = objects.append("circle") //year acquired
		.attr("class","acquired")
		.attr("cx", xYearAcquiredMap)
		.attr("cy", function(d, key) {
			return y(key);
		})
		.attr("r","2.5px");

	




	/* ------ SORTING FUNCTIONS THAT DO NOT WORK AT ALL ------ */

/*	var resortAcquire = d3.select("#sortAcquired")
		.on("click", function() {
			console.log("resorting by year acquired");
			objects.sort(function(a, b) {
				return d3.ascending(a.yearAcquired, b.yearAcquired);
			})
			.order()
			.transition()
			.duration(1000)
	    	.attr("transform", function() { 
	    		return "translate(" + margin.left + "," +margin.top + ")";
	    	});
    	});

		// sort data, bind new Y values, update graph?


   	var resortCreated = d3.select("#sortCreated")
		.on("click", function() {
			console.log("resorting by year created");
			objects.sort(function(a, b) {
				return d3.ascending(a.yearStart, b.yearStart);
			})
			.transition()
			.duration(1000)
	    	.attr("transform", function(d,i) { 
	    		return "translate(" + margin.left + "," + margin.top + ")";
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
	    		return "translate(" + margin.left + "," + margin.top + ")";
	    	});
    	});
*/




    /* ------ MOUSEOVER EVENTS FOR SELECTED OBJECT ------ */

    d3.selectAll("g").on("mouseover", function(d) {

    	//fade all objects
    	d3.selectAll('.object')
    	.transition()
    	.delay(100)
    	.duration(250)
    	.style('opacity','0.25');

    	//don't fade selected object
    	d3.select(this).selectAll('.object')
    	.transition()
    	.delay(100)
    	.duration(250)
    	.style('opacity','1');

    	//background highlight for selected object
    	d3.select(this).selectAll('.obj-trigger')
    	.transition()
    	.delay(100)
    	.duration(250)
    	.style("stroke-opacity","1.0");




    	




    	// VARIABLES FOR "THIS" (the object currently hovered over)

		var currentObject = d3.select(this);

    	//Created Marker Positions
    	var xPositionStart = parseFloat(currentObject.selectAll('.created').attr("x1"));
    	var xPositionEnd = parseFloat(currentObject.selectAll('.created').attr("x2"));
    	var xPositionMiddle = (xPositionStart + (xPositionEnd-xPositionStart))
    	var yPositionCreated = parseFloat(currentObject.selectAll('.created').attr("y1"));

    	//Acquired Marker Positions
    	var xPositionAcquired = parseFloat(currentObject.selectAll('g > circle').attr("cx"));
    	var yPositionAcquired = parseFloat(currentObject.selectAll('g > circle').attr("cy"));

    	//Exhibited Marker Positions
    	var xExhibitedStart = parseFloat(currentObject.selectAll('.exhibited').attr("x1"));
    	var xExhibitedEnd = parseFloat(currentObject.selectAll('.exhibited').attr("x2"));
    	var xExhibitedMiddle = (xExhibitedStart + (xExhibitedEnd-xExhibitedStart));
    	var yPositionExhibited = parseFloat(currentObject.selectAll('.exhibited').attr("y1"));



    	//     ADD THUMBNAIL FOR THIS OBJECT     //
		
		d3.select(this)
			.append("svg:image")
			.attr("class", "hoverImage")
    		.attr("x", xPositionStart - 75)
    		.attr("y", yPositionCreated - 25)
    		.attr("width","50px")
    		.attr("height","50px")
    		.attr("xlink:href",d.imageSQ)
    		.style("opacity","0")
    		.transition()
		    .delay(200)
		    .duration(550)
		    .style('opacity','1');




    	//     HIGHLIGHT RELATED OBJECTS     //

    	// set up variables for the moused-over data
    	var selectedYearAcquired = d.yearAcquired; // year to compare with
    	var selectedYearStarted = d.yearStart; // year to compare with
    	var selectedYearExhibited = d.exhibitStart; // year to compare with
    	
    	// filter object selection to match mouseover object years
		d3.selectAll('.object').filter(function(d) {
			return d.yearAcquired == selectedYearAcquired;
		})
			.each(function(d,i) {
				d3.select(this).select('.acquired')
					.transition()
		    		.delay(100)
		    		.duration(250)
					.style('fill','orange');//change circle to filled

				var subSel = d3.select(this).select('g > circle').attr("cy");
				svg.append("line")
					.attr("class","acquiredLine")
		    		.attr("x1", x(format.parse(selectedYearAcquired)))
		    		.attr("y1", subSel) // y pos of matched marker
		    		.attr("x2", x(format.parse(selectedYearAcquired)))
		    		.attr("y2", yPositionAcquired) // y pos of highlighted marker
		    		.attr("transform", function(d,i) { 
		    		return "translate(" + margin.left + "," + margin.top + ")";
		    		})
		    		.style('opacity','0')
		    		.transition()
		    		.delay(100)
		    		.duration(250)
		    		.style('opacity','1');
			})
			.transition()
			.style('opacity','1'); //matched objs stay solid


		d3.selectAll('.object').filter(function(d) {
			return d.yearStart == selectedYearStarted;
		})
			.each(function(d,i) {
				var subSel = d3.select(this).select('.created').attr("y1");
				svg.append("line")
					.attr("class","createdLine")
		    		.attr("x1", x(format.parse((selectedYearStarted).toString())))
		    		.attr("y1", subSel)
		    		.attr("x2", x(format.parse((selectedYearStarted).toString())))
		    		.attr("y2", yPositionCreated)
		    		.attr("transform", function(d,i) { 
		    		return "translate(" + margin.left + "," + margin.top + ")"
		    		})
		    		.style('opacity','0')
		    		.transition()
		    		.delay(100)
		    		.duration(250)
		    		.style('opacity','1');
			})
			.transition()
			.style('opacity','1'); //matched objs stay solid

		d3.selectAll('.object').filter(function(d) {
			return d.exhibitStart == selectedYearExhibited;
		})
			.each(function(d,i) {
				var subSel = d3.select(this).select('.exhibited').attr("y1");
				svg.append("line")
					.attr("class","exhibitLine")
					.attr("x1", x(format.parse((d.exhibitStart).toString())))
					.attr("y1", subSel)
					.attr("x2", x(format.parse((d.exhibitStart).toString())))
					.attr("y2", yPositionExhibited)
					.attr("transform", function(d,i) { 
		    		return "translate(" + margin.left + "," + margin.top + ")";
		    		})
		    		.style('opacity','0')
		    		.transition()
		    		.delay(100)
		    		.duration(250)
		    		.style('opacity','1');
			})
			.transition()
			.style('opacity','1'); //matched objs stay solid


	








    		

    	







    	//     YEAR LABELS     //


    	// CREATED
    	// if created spans single year
    	if (xPositionStart === xPositionEnd) {
    		currentObject.append("text")
    		.attr("class", "tooltip")
    		.attr("x", xPositionStart + 12)
    		.attr("y", yPositionCreated - 8)
    		.text(d.yearStart)
    		.style('opacity','0')
		    .transition()
		    .delay(100)
		    .duration(250)
		    .style('opacity','1');
    	}
		// if created spans less than 5 years
    	else if ((d.yearEnd - d.yearStart) <= 5) {
    		currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xPositionMiddle + 12)
	    		.attr("y", yPositionCreated  - 8)
	    		.text(d.yearStart + " - " + d.yearEnd)
	    		.style('opacity','0')
			    .transition()
			    .delay(100)
			    .duration(250)
			    .style('opacity','1');
    	}
    	// if created spans more than 5 years
    	if ((d.yearEnd - d.yearStart) > 5) {
    		currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xPositionStart +  12)
	    		.attr("y", yPositionCreated  - 8)
	    		.text(d.yearStart)
	    		.style('opacity','0')
			    .transition()
			    .delay(100)
			    .duration(250)
			    .style('opacity','1');

	    		currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xPositionEnd)
	    		.attr("y", yPositionCreated  - 8)
	    		.text(d.yearEnd)
	    		.style('opacity','0')
			    .transition()
			    .delay(100)
			    .duration(250)
			    .style('opacity','1');
    	}

    	
    	// ACQUIRED
    	// only show year if not already shown
    	if (d.yearEnd != d.yearAcquired || d.yearStart != d.yearAcquired) {
	    	currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xPositionAcquired + 12)
	    		.attr("y", yPositionAcquired  - 8)
	    		.text(d.yearAcquired)
	    		.style('opacity','0')
			    .transition()
			    .delay(100)
			    .duration(250)
			    .style('opacity','1');
    	}

    	
    	// EXHIBITED
    	// if exhibit spans single year
    	if (xExhibitedStart === xExhibitedEnd) {
    		currentObject.append("text")
    		.attr("class", "tooltip")
    		.attr("x", xExhibitedStart + 12)
    		.attr("y", yPositionExhibited  - 8)
    		.text(d.exhibitStart)
	    	.style('opacity','0')
		    .transition()
		    .delay(100)
		    .duration(250)
		    .style('opacity','1');
    	}
		// if exhibit spans less than 5 years
    	else if ((d.exhibitStart- d.exhibitEnd) <= 5) {
    		currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xExhibitedMiddle + 12)
	    		.attr("y", yPositionExhibited  - 8)
	    		.text(d.exhibitStart + " - " + d.exhibitEnd)
	    		.style('opacity','0')
			    .transition()
			    .delay(100)
			    .duration(250)
			    .style('opacity','1');
    	}
    	// if exhibit spans more than 5 years
    	if ((d.exhibitEnd - d.exhibitStart) > 5) {
    		currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xExhibitedStart + 12)
	    		.attr("y", yPositionExhibited  - 8)
	    		.text(d.exhibitStart)
	    		.style('opacity','0')
			    .transition()
			    .delay(100)
			    .duration(250)
			    .style('opacity','1');

	    		currentObject.append("text")
	    		.attr("class", "tooltip")
	    		.attr("x", xExhibitedEnd + 12)
	    		.attr("y", yPositionExhibited  - 8)
	    		.text(d.exhibitEnd)
		    	.style('opacity','0')
			    .transition()
			    .delay(100)
			    .duration(250)
			    .style('opacity','1');
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

    	d3.select(this).selectAll(".tooltip")
    	.transition()
    	.duration(250)
    	.remove();

    	d3.select(this).selectAll(".hoverImage")
    	.style('opacity','1')
		.transition()
    	.duration(250)
    	.style('opacity','0')
    	.remove();


    	d3.select("svg").selectAll(".acquiredLine, .createdLine, .exhibitLine")
    	.attr("opacity","1")
    	.transition()
    	.duration(250)
    	.attr("opacity","0")
    	.remove();

    	d3.selectAll(".object").selectAll('.acquired')
    	.transition()
    	.duration(250)
		.style('fill','white'); //change circle back to white
    });







    /* ------ FUNCTIONS FOR OBJECT DETAIL VIEW ------ */

	// event listener on objects
	d3.selectAll("g").on("click", function(d) {
		generateObjectView(d);
	});


	$("body").on('click', '.detailImage', function() {
		$("#objDetailBox").fadeOut();
		$("#objDetailFade").fadeOut();
		setTimeout(function() {
			$("#objDetailFade").remove();
		}, 500);
	});



}; // end of graphing function






/* ------ FUNCTION FOR PROCESSING THE API DATA ------ */

//run after function with callback function and length of object array
var done = after(makeGraph, objectsIDList.length);


// AFTER LOOPING THROUGH ID LIST AND COMPLETING AJAX REQUESTS...
// checks if counter is equal to the length of objects being looped through
function after(callback, count){
	var counter = 0;
	return function(){
		if(++counter === count) {
			counter = 0;

			removeLoader();
			callback();
		}
	};
}





/* ------ FUNCTIONS / EVENTS FOR LOADING SCREEN ------ */

function removeLoader() {
	$("button#loaded").fadeIn("slow");
	$("img.loaderImage").fadeOut("slow");
	$("img.loaderImage").remove();
	$("button#loaded").click(function() {
		$("#loader").fadeOut("slow");
	});
}

// event listener to bring back "about" page
$("#projectTitle").click(function() {
	$("#loader").fadeIn("slow");
});








/* ------ FUNCTIONS / EVENTS FOR OBJECT DETAIL VIEW ------ */

// d = object to match properties to
function filterMatchedObjects(d) {

	var allMatchedObjects = [];

	var matchAcquiredYear = d.yearAcquired;
	var matchStartYear = d.yearStart;
	var matchEndYear = d.yearEnd;
	var matchExhibit = d.exhibitTitle;


	// objects with same acquired year
	// returns an array with an array of matched objects
	d3.selectAll('.object').filter(function(d) {
			return d.yearAcquired == matchAcquiredYear;		
	}).each(function(d,i) {
			allMatchedObjects.push(d); 
	}); 


	d3.selectAll('.object').filter(function(d) {
			return d.yearStart == matchStartYear;		
	}).each(function(d,i) {
			allMatchedObjects.push(d); 
	}); 

	d3.selectAll('.object').filter(function(d) {
			return d.yearEnd == matchEndYear;		
	}).each(function(d,i) {
			allMatchedObjects.push(d); 
	}); 

	d3.selectAll('.object').filter(function(d) {
			return d.exhibitTitle == matchExhibit;		
	}).each(function(d,i) {
			allMatchedObjects.push(d); 
	}); 

	return allMatchedObjects;
}


function randomIndexValue(length) {
	return Math.floor(Math.random() * length);
}


function randomObjectObject(objectList, d) {
	var index = randomIndexValue(objectList.length);
	var object = objectList[index];

	return object;
}



function generateObjectView(d) {

		// check if object detail view already exists...
	var checkObjectView = $("#objDetailFade");
	// remove it if it does
	if (checkObjectView.is("html *")) {
		$("#objDetailBox").fadeOut();
		$("#objDetailFade").fadeOut();
		setTimeout(function() {
			$("#objDetailFade").remove();
		}, 500);
	}


	// call function to filter matching objects
	var matchedObjects = filterMatchedObjects(d);

	var acquiredMatch = d.yearAcquired;
	var startMatch = d.yearStart;
	var endMatch = d.yearEnd;
	var exhibitMatch = d.exhibitTitle;


	if ( d.yearStart == d.yearEnd ) {
		var createdHTML = "</a> in <a href=''>" + d.yearStart + "</a>.";
	} 
	else if ( d.yearStart != d.yearEnd ) {
		var createdHTML = "</a> between <a href=''>" + d.yearStart + "</a> and <a href=''>" + d.yearEnd + "</a>.";
	}

	
	$("body").append("<div id='objDetailFade'><div id='objDetailBox'><img class='detailImage' src=" + d.imageURL + " ></img><h1>" + d.objTitle + "</h1><p class='blurb'>This was created by <a href=''>" + d.designer + createdHTML + "It was acquired by the Cooper Hewitt in <a href=''>" + d.yearAcquired + "</a>. During <a href=''>" + d.exhibitStart + "</a>, it was part of the <a href=''>" + d.exhibitTitle + "</a> exhibition.</p><p class='description'>" + d.objDescription + "</p></div></div>");

	$("#objDetailFade, #objDetailBox").fadeIn();



	var miniTimeline = d3.select(".blurb")
		.append("svg")
		.attr("id","miniTime")
		.attr("width",305)
		.attr("height",20);

	miniTimeline.append("line") //overall connection line for each obj
		.attr("class","lines") // set class for CSS styling
		.attr("x1", 10)
		.attr("y1", 10)
		.attr("x2", 250)
		.attr("y2", 10);

	miniTimeline.append("line") //years created
		.attr("class","created") 
		.attr("x1", 10)
		.attr("y1", 10)
		.attr("x2", 10)
		.attr("y2", 10);

	miniTimeline.append("line") //years exhibited
		.attr("class","exhibited") 
		.attr("x1", 240)
		.attr("y1", 10)
		.attr("x2", 250)
		.attr("y2", 10);

	miniTimeline.append("circle") //year acquired
		.attr("class","acquired")
		.attr("cx", 200)
		.attr("cy", 10)
		.attr("r","2.5px");




	// 5 random related objects
	var randomObjectSet = [];
	for (i = 0; i < 5; i++) {
		randomObjectSet.push(randomObjectObject(matchedObjects, d))
	};
	console.log("Random Objects: " + randomObjectSet);


	// WHY IS THIS NOT APPEARING A SECOND TIME????
	var imageSVG = d3.select("#objDetailBox")
			.append("svg")
			.attr("id","matchObjects")
			.attr("width", 310)
			.attr("height", 60);

	imageSVG.selectAll(".matchImage")
		.data(randomObjectSet)
		.enter()
		.append("svg:image")
		.attr("class", "matchImage")
    	.attr("x", function(d,i) {
			return (i)*62 + 3;
		})
		.attr("y", 3)
		.attr("width","48px")
		.attr("height","48px")
		.attr("xlink:href", function(d) {
			return d.imageSQ;
		});

	imageSVG.selectAll("rect")
		.data(randomObjectSet)
		.enter()
		.append("rect")
    	.attr("x", function(d,i) {
			return (i)*62;
		})
		.attr("y", 0)
		.attr("width","54px")
		.attr("height","54px")
		.attr("stroke",function(d){
			if (d.yearAcquired == acquiredMatch) {
				return "orange";
			} else if (d.yearStart == startMatch || d.yearEnd == endMatch) {
				return "teal";
			} else if (d.exhibitTitle == exhibitMatch) {
				return "purple";
			}
		})
		.attr("fill","none");



	d3.selectAll(".matchImage").on("click", function(d) {
		generateObjectView(d);
	});

}


