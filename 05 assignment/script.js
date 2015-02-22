
//remove any leading and trailing blank space
function trim (str) {
	return str.replace(/^\s+|\s+$/g, '');
}




function checkForm() {

	//assign variable for sign up form object
	var signUpForm = document.forms["signup"];

	//assign variable to first name element in the form
	var firstName = signUpForm.elements["firstname"];
	var firstNameValue = firstName.value;

	// Verify first name is greater than 2 characters
	trimmedFirstName = trim(firstNameValue); 
	if (trimmedFirstName >= 15) {

		var errorText = document.createTextNode("Your first name must be greater than 2 characters.");
		errorText.setAttribute("class", "error");
		firstName.appendChild(errorText); // add text node to first name element

		alert("uh oh!");
	}
}