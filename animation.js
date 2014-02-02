function animate (shapeArray, context, canvas, confirmedCollisions, lastFrame, physics) {
	var time = ((new Date()).getTime() - lastFrame); //miliseconds since last frame
	var cycleNumbers = false;

	//requests next frame right away, in case polyfill is used
	requestAnimationFrame(function() {animate(shapeArray, context, canvas, confirmedCollisions, time, physics)});
	
	//resolves collisions from last frame
	for (var g = 0; g < confirmedCollisions.length; g++) {

		var collision = confirmedCollisions[g];
		if !(collision[0].targets(collision[1]) || collision[1].targets(collision[0])) {

			//implement collision reaction.
		}

		else {

			if (collision[0].player) {

				var playerShape = collision[0];
				var targetShape = collision[1];
			}
			
			else {

				var playerShape = collision[1];
				var targetShape = collision[0];
			}

			targetShape.doomed = true;
			playerShape.player.score += 5;

			cycleNumbers = true;
		}
	}
	
	if (cycleNumbers) {
		newNumbers(shapeArray, gameCanvas, physics);
	}

	//accelerates shapes, moves them, checks for collisions to resolve next frame, then draws
	//shapes
	for (var i = 0; i < shapeArray.length; i++) {

		var shape = shapeArray[i];

		shape.applyAccel(time);
		shape.move(time, gameCanvas);

		//check for collisions
		for (var j = i + 1; j < shapeArray.length; j++) {

			if (!(shape === shapeArray[j]) && shape.checkCollision(shapeArray[j])) {

				confirmedCollisions.push([shape, shapeArray[j]]);
			}
		}

		shape.draw(ctext);

	}
}
