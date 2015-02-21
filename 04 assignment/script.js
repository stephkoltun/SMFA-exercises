function randomFruit(array) {
	
	var length = array.length;

	var randomNum = Math.floor((Math.random() * length) + 1);
	var fruit = array[randomNum];
	console.log(fruit);

	document.write("My least favourite type of fruit is " + fruit + ".");
}