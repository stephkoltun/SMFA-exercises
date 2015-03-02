// function to check length of form input
function checkLength(input, length) {

	if (input.value.length <= length) {
		return false
	} else {
		return true
	}
};



/*


function pickColor(e) {
	// Change background color of form
	if (color1.checked) {
		//alert("you picked blue!");
		document.body.style.backgroundColor = "#0f9fb4";
	}

	if (color2.checked) {
		//alert("you picked blue!");
		document.body.style.backgroundColor = "#ff9c5f";
	}

	if (color3.checked) {
		//alert("you picked blue!");
		document.body.style.backgroundColor = "#806288";
	}

	if (color4.checked) {
		//alert("you picked blue!");
		document.body.style.backgroundColor = "#78c3ae";
	}
}





var color1 = signUpForm.elements[6];
color1.addEventListener('change', pickColor, false);

var color2 = signUpForm.elements[7];
color2.addEventListener('change', pickColor, false);

var color3 = signUpForm.elements[8];
color3.addEventListener('change', pickColor, false);

var color4 = signUpForm.elements[9];
color4.addEventListener('change', pickColor, false);
*/





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
		var nameErrorMsg = "<span class='errormsg' id='firstnameerror'>* must be at least 2 characters long</span>";

		// add error message after label for first name
		$firstNameLabel.after(nameErrorMsg);

		// jquery methods to change classes of input field so that error styling is used
		$(firstNameInput).addClass("errorfield");
		$(firstNameInput).removeClass("signupinput");
	}
	// check if first name had previously been incorrect (signified by errorfield class) but is now correct 	
	else if ( validFirstName && ($(firstNameInput).attr('class') == "errorfield") ) {

		// change back to default input field styling
		$(firstNameInput).addClass("signupinput");
		$(firstNameInput).removeClass("errorfield");

		// remove error message
		$('span#firstnameerror').remove();
	}





	// ----- LAST NAME ----- //

	var lastNameInput = signUpForm.elements["lastname"];
	var validLastName = checkLength(lastNameInput, 2);

	// if the check length function returns false, add error message and change styling
	if (! validLastName) {

		// set variables for the label and error message to be added
		var $lastNameLabel = $('label[for="lastname"]');
		var nameErrorMsg = "<span class='errormsg' id='lastnameerror'>* must be at least 2 characters long</span>";

		// add error message after label for last name
		$lastNameLabel.after(nameErrorMsg);

		// jquery methods to change classes of input field so that error styling is used
		$(lastNameInput).addClass("errorfield");
		$(lastNameInput).removeClass("signupinput");	
	} 
	// check if last name had previously been incorrect (signified by errorfield class) but is now correct 	
	else if ( validLastName && ($(lastNameInput).attr('class') == "errorfield") ) {

		// change back to default input field styling
		$(lastNameInput).addClass("signupinput");
		$(lastNameInput).removeClass("errorfield");

		// remove error message
		$('span#lastnameerror').remove();
	}





	// ----- EMAIL ----- //

	var emailInput = signUpForm.elements["email"];

	var validEmail = /[^@]+@[^@]+/.test(emailInput.value);
	if (! validEmail) {

		var $emailLabel = $('label[for="email"]');
		var emailErrorMsg = "<span class='errormsg' id='emailerror'>* email address is not valid</span>";

		// add error message after label for first name
		$emailLabel.after(emailErrorMsg);

		// jquery methods to change classes of input field so that error styling is used
		$(emailInput).addClass("errorfield");
		$(emailInput).removeClass("signupinput");

	} 
	// check if email had previously been incorrect (signified by errorfield class) but is now correct 	
	else if ( validEmail && ($(emailInput).attr('class') == "errorfield") ) {

		// change back to default input field styling
		$(emailInput).addClass("signupinput");
		$(emailInput).removeClass("errorfield");

		// remove error message
		$('span#emailerror').remove();
	}





	// ----- USERNAME ----- //

	var usernameInput = signUpForm.elements["username"];
	var validUsername = checkLength(usernameInput, 7);

	// if the check length function returns false, add error message and change styling
	if (! validUsername) {

		// set variables for the label and error message to be added
		var $usernameLabel = $('label[for="username"]');
		var usernameErrorMsg = "<span class='errormsg' id='usernameerror'>* must be at least 8 characters long</span>";

		// add error message after label for last name
		$usernameLabel.after(usernameErrorMsg);

		// jquery methods to change classes of input field so that error styling is used
		$(usernameInput).addClass("errorfield");
		$(usernameInput).removeClass("signupinput");
	} 
	// check if username had previously been incorrect (signified by errorfield class) but is now correct 	
	else if ( validUsername && ($(usernameInput).attr('class') == "errorfield") ) {

		// change back to default input field styling
		$(usernameInput).addClass("signupinput");
		$(usernameInput).removeClass("errorfield");

		// remove error message
		$('span#usernameerror').remove();
	}




	// ----- PASSWORD ----- //

	var passwordInput = signUpForm.elements["password"];
	var validPassword = /[0-9]/.test(passwordInput.value);
	var validPasswordLength = checkLength(passwordInput, 8);

	if ((! validPassword) || (! validPasswordLength)) {

		// set variables for the label and error message to be added
		var $passwordLabel = $('label[for="password"]');
		var passwordErrorMsg = "<span class='errormsg' id='passworderror'>* must be greater than 8 characters long and contain a number</span>";

		// add error message after label for password
		$passwordLabel.after(passwordErrorMsg);

		// jquery methods to change classes of input field so that error styling is used
		$(passwordInput).addClass("errorfield");
		$(passwordInput).removeClass("signupinput");
	}



	// ----- PASSWORD MATCH ----- //
	var passwordConfirm = signUpForm.elements["passwordconfirm"];

	if (passwordConfirm.value != passwordInput.value) {
		// set variables for the label and error message to be added
		var $passwordConfirmLabel = $('label[for="passwordconfirm"]');
		var passwordConfirmErrorMsg = "<span class='errormsg' id='matcherror'>* passwords must match</span>";

		// add error message after label for password match
		$passwordConfirmLabel.after(passwordConfirmErrorMsg);

		// jquery methods to change classes of input field so that error styling is used
		$(passwordConfirm).addClass("errorfield");
		$(passwordConfirm).removeClass("signupinput");
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
	
}












/*function submitForm() {

//check if fields are empty

//print values to screen

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
}*/








