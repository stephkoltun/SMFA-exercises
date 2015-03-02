// function to check length of form input
function checkLength(input, length) {

	if (input.value.length <= length) {
		return false
	} else {
		return true
	}
};

//remove any leading and trailing blank space
function trim (str) {
	return str.replace(/^\s+|\s+$/g, '');
}


function addError (label, errorId, msg, inputfield) {
	var errorMsg = "<span class='errormsg' id=" + errorId + "> * " + msg + "</span>";
	// add error message after label for input field
	label.after(errorMsg);

	// change classes of input field so that error styling is used
	$(inputfield).addClass("errorfield");
	$(inputfield).removeClass("signupinput");
}


function removeError (errorId, inputfield) {
	// remove error message
	var errorIdValue = 'span#' + errorId;
	$(errorIdValue).remove();

	// change back to default input field styling
	$(inputfield).addClass("signupinput");
	$(inputfield).removeClass("errorfield");
}







var signUpForm = document.forms["signup"];
signUpForm.addEventListener('submit', validate);


// validate form inputs
function validate() {

	// ----- FIRST NAME ----- //
	
	var firstNameInput = signUpForm.elements["firstname"];
	var validFirstName = checkLength(firstNameInput, 2);

	// if the check length function returns false, add error message and change styling
	if (! validFirstName) {
		// set variables for the label and error message to be added
		var $firstNameLabel = $('label[for="firstname"]');
		//call error styling function
		addError($firstNameLabel, 'firstnameerror', "must be at least 2 characters long", firstNameInput);
	}

	// check if first name had previously been incorrect (signified by errorfield class) but is now correct 	
	if ( validFirstName && ($(firstNameInput).attr('class') == "errorfield") ) {
		//call remove error function
		removeError('firstnameerror', firstNameInput);
	}





	// ----- LAST NAME ----- //

	var lastNameInput = signUpForm.elements["lastname"];
	var validLastName = checkLength(lastNameInput, 2);

	// if the check length function returns false, add error message and change styling
	if (! validLastName) {
		// set variables for the label and error message to be added
		var $lastNameLabel = $('label[for="lastname"]');
		//call error styling function
		addError($lastNameLabel, 'lastnameerror', "must be at least 2 characters long", lastNameInput);	
	} 

	// check if last name had previously been incorrect (signified by errorfield class) but is now correct 	
	if ( validLastName && ($(lastNameInput).attr('class') == "errorfield") ) {
		//call remove error function
		removeError('lastnameerror', lastNameInput);
	}





	// ----- EMAIL ----- //

	var emailInput = signUpForm.elements["email"];
	var validEmail = /[^@]+@[^@]+/.test(emailInput.value);
	if (! validEmail) {

		var $emailLabel = $('label[for="email"]');
		//call error styling function
		addError($emailLabel, 'emailerror', "must be a valid email address", emailInput);	
	} 

	// check if email had previously been incorrect (signified by errorfield class) but is now correct 	
	if ( validEmail && ($(emailInput).attr('class') == "errorfield") ) {
		//call remove error function
		removeError('emaileerror', emailInput);
	}





	// ----- USERNAME ----- //

	var usernameInput = signUpForm.elements["username"];
	var validUsername = checkLength(usernameInput, 7);

	// if the check length function returns false, add error message and change styling
	if (! validUsername) {

		// set variables for the label and error message to be added
		var $usernameLabel = $('label[for="username"]');
		//call error styling function
		addError($usernameLabel, 'usernameerror', "must be at least 8 characters long", usernameInput);
	} 
	// check if username had previously been incorrect (signified by errorfield class) but is now correct 	
	else if ( validUsername && ($(usernameInput).attr('class') == "errorfield") ) {
		//call remove error function
		removeError('usernameeerror', usernameInput);
	}



	// ----- PASSWORD ----- //

	var passwordInput = signUpForm.elements["password"];
	var validPassword = /[0-9]/.test(passwordInput.value);
	var validPasswordLength = checkLength(passwordInput, 8);

	if ((! validPassword) || (! validPasswordLength)) {

		// set variables for the label and error message to be added
		var $passwordLabel = $('label[for="password"]');
		//call error styling function
		addError($passwordLabel, 'passworderror', "must be at least 8 characters long and contain a number", passwordInput);
	}
	// check if username had previously been incorrect (signified by errorfield class) but is now correct 
	else if ( validPassword && ($(passwordInput).attr('class') == "errorfield") ) {
		//call remove error function
		removeError('passwordeerror', passwordInput);
	}



	// ----- PASSWORD MATCH ----- //
	var passwordConfirm = signUpForm.elements["passwordconfirm"];
	var passwordMatch = (passwordConfirm.value == passwordInput.value);

	if (! passwordMatch) {
		// set variables for the label and error message to be added
		var $passwordConfirmLabel = $('label[for="passwordconfirm"]');
		//call error styling function
		addError($passwordConfirmLabel, 'matcherror', "passwords must match", passwordConfirm);
	} else if ( passwordMatch && ($(passwordConfirm).attr('class') == "errorfield") ) {
		//call remove error function
		removeError('matcheerror', passwordConfirm);
	}


	// ----- COLOR PICKER ----- //
	var $blue = $('input[value="blue"]');
	if ($blue.is(':checked')) {
		$('body').css('backgroundColor','#0f9fb4');
	}

	var $orange = $('input[value="orange"]');
	if ($orange.is(':checked')) {
		$('body').css('backgroundColor', '#ff9c5f');
	}

	var $purple = $('input[value="purple"]');
	if ($purple.is(':checked')) {
		$('body').css('backgroundColor', '#806288');
	}

	var $green = $('input[value="green"]');
	if ($green.is(':checked')) {
		$('body').css('backgroundColor', '#78c3ae');
	}


	// how to do I print the form only if there are no errors?
	printForm();

}





function printForm() {
	// object containing form, to which we'll add the form values	
	var formContent = document.getElementById("formcontent");
	
	//assign variable for sign up form object
	var signUpForm = document.forms["signup"];

	//assign variables for each fieldset
	var nameFieldset = document.getElementById("nameInfo");
	var userFieldset = document.getElementById("userInfo");
	var colorFieldset = document.getElementById("pickColor");

	//assign variables to each element in the form
	var firstName = signUpForm.elements["firstname"].value;
	trimmedFirstName = trim(firstName); 

	var lastName = signUpForm.elements["lastname"].value;
	trimmedLastName = trim(lastName);

	var email = signUpForm.elements["email"].value;
	trimmedEmail = trim(email);

	var userName = signUpForm.elements["username"].value;
	trimmedUserName = trim(userName);

	var password = signUpForm.elements["password"].value;


	//create new div to add the form values into
	var formValues = document.createElement("div");
	formValues.setAttribute("id","formValues");


	var namePara = document.createElement("div");
	namePara.setAttribute("class","formText");
	var nameText = document.createTextNode("Name: " + trimmedFirstName + " " + trimmedLastName);
	namePara.appendChild(nameText);
	formValues.appendChild(namePara);

	var emailPara = document.createElement("div");
	emailPara.setAttribute("class","formText");
	var emailText = document.createTextNode("Email: " + trimmedEmail);
	emailPara.appendChild(emailText);
	formValues.appendChild(emailPara);

	var userPara = document.createElement("div");
	userPara.setAttribute("class","formText");
	var userText = document.createTextNode("Username: " + trimmedUserName);
	userPara.appendChild(userText);
	formValues.appendChild(userPara);

	var passwordPara = document.createElement("div");
	passwordPara.setAttribute("class","formText");
	var passwordText = document.createTextNode("Password: " + password);
	passwordPara.appendChild(passwordText);
	formValues.appendChild(passwordPara);


	formContent.appendChild(formValues);
}








