//remove any leading and trailing blank space
function trim (str) {
	return str.replace(/^\s+|\s+$/g, '');
}

function displayError(msg, fieldset, nodeNum) {
	var errorPara = document.createElement("p");
	errorPara.setAttribute("class", "errormsg");
	var errorText = document.createTextNode(msg);
	errorPara.appendChild(errorText); // add text node to error paragraph element

	fieldset.insertBefore(errorPara, fieldset.childNodes[nodeNum]);
}

function checkForm() {

	var signUpDiv = document.getElementById("formcontent");

	//assign variable for sign up form object
	var signUpForm = document.forms["signup"];

	//assign variables for each fieldset
	var nameFieldset = document.getElementById("nameInfo");
	var userFieldset = document.getElementById("userInfo");
	var colorFieldset = document.getElementById("pickColor");
	

	//assign variables to each element in the form
	var firstName = signUpForm.elements["firstname"];
	var firstNameValue = firstName.value;
	trimmedFirstName = trim(firstNameValue); 

	var lastName = signUpForm.elements["lastname"];
	var lastNameValue = lastName.value;
	trimmedLastName = trim(lastNameValue);

	var email = signUpForm.elements["email"];
	var emailValue = email.value;
	trimmedEmailValue = trim(emailValue);

	var userName = signUpForm.elements["username"];
	var userNameValue = userName.value;
	trimmedUserName = trim(userNameValue);

	var password = signUpForm.elements["password"];
	var passwordValue = password.value;

	var passwordConfirm = signUpForm.elements["passwordconfirm"];
	var passwordConfirmValue = passwordConfirm.value;

	var color1 = signUpForm.elements["color1"];
	var color2 = signUpForm.elements["color2"];
	var color3 = signUpForm.elements["color3"];
	var color4 = signUpForm.elements["color4"];



	// Verify first name is greater than 2 characters
	if (trimmedFirstName.length <= 2) {
		firstName.setAttribute("class","errorfield");
		displayError("Your first name must be greater than 2 characters.", nameFieldset, 3);
	}


	// Verify last name is greater than 2 characters
	if (trimmedLastName.length <= 2) {
		lastName.setAttribute("class","errorfield");
		displayError("Your last name must be greater than 2 characters.", nameFieldset, 10);
	}


	// Verify email address
	var validEmail = /[^@]+@[^@]+/.test(trimmedEmailValue);
	if (!validEmail) {
		email.setAttribute("class","errorfield");
		displayError("Please enter a valid email address.", nameFieldset, 17);
	}	


	// Verify username is greater than 7 characters
	if (trimmedUserName.length <= 7) {
		userName.setAttribute("class","errorfield");
		displayError("Your username must be greater than 7 characters.", userFieldset, 3);
	}


	// Verify password is greater than 8 characters and contains a number
	var validPassword = /[0-9]/.test(passwordValue);
	if ((passwordValue.length <= 8) && (!validPassword)) {
		password.setAttribute("class","errorfield");
		displayError("Your password must be greater than 8 characters and contain a number.", userFieldset, 8);
	}


	// Confirm passwords are the same
	if (passwordValue != passwordConfirmValue) {
		passwordConfirm.setAttribute("class","errorfield");
		displayError("Your passwords do not match.", userFieldset, 12);
	}


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

	// display all errors
	return false;
}




