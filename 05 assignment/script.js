//remove any leading and trailing blank space
function trim (str) {
	return str.replace(/^\s+|\s+$/g, '');
}

// ----- IMPORTANT VARIABLES ----- //

//assign variable for sign up form object
var signUpForm = document.forms["signup"];

//assign variables for each fieldset
var nameFieldset = document.getElementById("nameInfo");
var userFieldset = document.getElementById("userInfo");
var colorFieldset = document.getElementById("pickColor");



// function for displaying error message if input is not valid
function displayError(msg, fieldset, nodeNum, idName) {
	var errorPara = document.createElement("p");
	errorPara.setAttribute("class", "errormsg");
	errorPara.setAttribute("id", idName);
	var errorText = document.createTextNode(msg);
	errorPara.appendChild(errorText); // add text node to error paragraph element

	fieldset.insertBefore(errorPara, fieldset.childNodes[nodeNum]); //add error message before input field
}

// function for removing error message when input is valid
function removeErrorMessage(parentId,childId) {
	var parentNode = document.getElementById(parentId);
	var childNode = document.getElementById(childId);
	parentNode.removeChild(childNode);
}


function checkFirstName(e) {
	var target = e.target || e.srcElement;
	// Verify last name is greater than 2 characters
	if (target.value.length <= 2) {
		firstName.setAttribute("class","errorfield"); // border red
		displayError("Your first name must be greater than 2 characters.", nameFieldset, 3, "firstnameerror");
	} else {
		firstName.setAttribute("class","signupinput"); // default grey border
		removeErrorMessage("nameInfo", "firstnameerror");
	}
}


function checkLastName(e) {
	var target = e.target || e.srcElement;
	// Verify last name is greater than 2 characters
	if (target.value.length <= 2) {
		lastName.setAttribute("class","errorfield"); // border red
		displayError("Your last name must be greater than 2 characters.", nameFieldset, 9, "lastnameerror");
	} else {
		lastName.setAttribute("class","signupinput"); // default grey border
		removeErrorMessage("nameInfo", "lastnameerror");
	}
}


function checkEmail(e) {
	var target = e.target || e.srcElement;
	// Verify email is in correct format
	var validEmail = /[^@]+@[^@]+/.test(target.value);
	if (!validEmail) {
		email.setAttribute("class","errorfield");
		displayError("Please enter a valid email address.", nameFieldset, 15, "emailerror");
	} else {
		email.setAttribute("class","signupinput"); // default grey border
		removeErrorMessage("nameInfo", "emailerror");
	}
}


function checkUsername(e) {
	var target = e.target || e.srcElement;
	// Verify username is greater than 7 characters
	if (target.value.length <= 7) {
		userName.setAttribute("class","errorfield");
		displayError("Your username must be greater than 7 characters.", userFieldset, 3, "usernameerror");
	} else {
		userName.setAttribute("class","signupinput"); // default grey border
		removeErrorMessage("userInfo", "usernameerror");
	}
}


function checkPassword(e) {
	var target = e.target || e.srcElement;
	// Verify password is greater than 8 characters and contains a number
	var validPassword = /[0-9]/.test(target.value);
	if ((target.value.length <= 8) && (!validPassword)) {
		password.setAttribute("class","errorfield");
		displayError("Your password must be greater than 8 characters and contain a number.", userFieldset, 7, "passworderror");
	} else {
		password.setAttribute("class","signupinput"); // default grey border
		removeErrorMessage("userInfo", "passworderror");
	}
}


// Check that passwords are the same
function matchPassword(e) {
	var target = e.target || e.srcElement;
	var passwordValue = signUpForm.elements["password"].value;
	if (target != passwordValue) {
		passwordConfirm.setAttribute("class","errorfield");
		displayError("Your passwords do not match.", userFieldset, 11, "matcherror");
	} else {
		passwordConfirm.setAttribute("class","signupinput"); // default grey border
		removeErrorMessage("userInfo", "matcherror");
	}
}

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


//add listener to check first name length after focusing out
var firstName = signUpForm.elements["firstname"];
firstName.addEventListener('focusout', checkFirstName, false);

//add listener to check last name length after focusing out
var lastName = signUpForm.elements["lastname"];
lastName.addEventListener('focusout', checkLastName, false);

//add listener to validate email address after focusing out
var email = signUpForm.elements["email"];
email.addEventListener('focusout', checkEmail, false);

//add listener to check username length after focusing out
var userName = signUpForm.elements["username"];
userName.addEventListener('focusout', checkUsername, false);

//add listener to check password length after focusing out
var password = signUpForm.elements["password"];
password.addEventListener('focusout', checkPassword, false);

//add listener to check password match after focusing out
var passwordConfirm = signUpForm.elements["passwordconfirm"];
passwordConfirm.addEventListener('focusout', matchPassword, false);

var color1 = signUpForm.elements["color1"];
color1.addEventListener('change', pickColor, false);

var color2 = signUpForm.elements["color2"];
color2.addEventListener('change', pickColor, false);

var color3 = signUpForm.elements["color3"];
color3.addEventListener('change', pickColor, false);

var color4 = signUpForm.elements["color4"];
color4.addEventListener('change', pickColor, false);





function submitForm() {

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
}








