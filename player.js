function Player(name, shapeinfo, physics, keys, number) {
	this.score = 0;
	this.name = name;
	this.shape = new Rectangle(shapeinfo.x, shapeinfo.y, shapeinfo.width, shapeinfo.height, shapeinfo.fillStyle, physics, keys, shapeinfo.keymap, this);
	this.target = null;

}


function newNumbers(array, gameCanvas, physics) {

	var takenNumbers = [];
	var playerShape = null;

	for (var i = 0; i < array.length; i++) {

		var shape = array[i];
		var numTaken = true;
		if (shape.player) {

			playerShape = shape;
			continue;
		}

		while (numTaken) {

			var randNum = Math.ceil(Math.random() * shape.physics.maxVal);
			if (takenNumbers.indexOf(randNum) < 0) {

				numTaken = false;
				shape.mathValue = randNum
				shape.mathString = randNum.toString();
				takenNumbers.push(randNum);
			}

/*			//failsafe if all values are taken
			if (takenNumbers.length >= shape.physics.maxVal) {

				//shape is removed if there are more taken numbers
				//than its max value
				shape.doomed = true;
				numTaken = false;
			}
*/
		}

		if (shape.doomed) {

                        array.splice(i, 1);
                        array.push(new Circle(gameCanvas, physics));
                        i -= 1;
                        continue;
                }
	}

	playerShape.player.target = array[Math.floor(Math.random() * (array.length - 1)) + 1];
	playerShape.mathValue = playerShape.player.target.mathValue;
	
	var op1
	var op2
	var operator

	//creates addition problem
	if (Math.random() >= .5) {

		op1 = Math.floor(Math.random() * playerShape.mathValue + 1);
		op2 = playerShape.mathValue - op1;
		operator = ' + '
	}

	else {

		op1 = Math.floor(Math.random() * (playerShape.physics.maxVal - playerShape.mathValue) + playerShape.mathValue)
		op2 = op1 - playerShape.mathValue;
		operator = ' - ';
	}

	playerShape.mathString = '' + op1  + operator  + op2 + ' =';
}

function shapeInfo (x, y, width, height, color, keymap) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.fillStyle = color;
	this.keymap = keymap;
}

function randomColor() {
	var letters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function getGrey(value, max) {
	var color = '#';
	var hexValue;
	if (arguments.length <= 0) {	
		var randInt = Math.floor(Math.random() * 16);
		hexValue = randInt.toString(16);
	}
	else {
		var divisor = max / 16;
		hexValue = Math.round(value/divisor).toString(16);
	}
	if (hexValue.length > 1) { hexValue = "0" + hexValue; }
	return color += hexValue + hexValue + hexValue;
}
