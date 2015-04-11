//Gets acquistion year and completetion year for specific object

//Cooper Hewitt API token 
var token = "2907bb23a319de02d7174829a85eef94";

//Random Selection of Objects

var objectsIDList = [
			"18700327","18700329","18700427","18700463","18700465","18700487","18702279","18702283","18702573","18705893","18707303","35520811","35520817","51497205","51497673","52027699","68862903","18702819","18729905","18732835","18732295","68862901","35520793"
			];

for (i = 0; i < objectsIDList.length; i++) {

	//get info about a specific object method - returns JSON
	var url ='https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.getInfo&access_token=' + token + '&object_id=' + objectsIDList[i];

	//AJAX request
	var request = $.get(url, function( response ) {
		var objResponse = response; // variable to hold the response
		var obj = objResponse.object;

		var objTitle = obj.title;		//variable for the title of the object

		var objYearEnd = obj.year_end;	//variable for when object was finished
		var objYearStart = obj.year_start;	//variable for when object was started
		var objDate = obj.date.substring(0,4);

		var objAcquired = obj.year_acquired;	//variable for acquisition date

		if (objYearEnd == "null" || objYearStart == "null") {
			objYearEnd = objDate;
			objYearStart = objDate;
		}

		var creationAge = objYearEnd - objYearStart;
		var acquisitionAge = objAcquired - objYearStart;

	
		
		//var $msg = "<p>" + objTitle + ", created in " + objDate + ", was aquired by the Cooper Hewitt in " + objAcquired + ".</p>";
		var $msg = "<h3>" + objTitle + "</h3><br><p>Created in " + objYearStart + " - " + objYearEnd + "<br>Acquired in " + objAcquired + "<br>Creation Lifespan: " + creationAge + "<br>Acquision Lifespan: " + acquisitionAge;
		$('#test').after($msg);

	});

}




