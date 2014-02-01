function animate (shapeArray, context, canvas, confirmedCollisions, lastFrame, physics) {
	var time = ((new Date()).getTime() - lastFrame); //miliseconds since last frame

	//requests next frame right away, in case polyfill is used
	requestAnimationFrame(function() {animate(shapeArray, context, canvas, confirmedCollisions, time, physics)});
	
	//resolves collisions from last frame
	for (var g = 0; g < confirmedCollisions.length; g++) {

		var collision = confirmedCollisions[g];
		for (var h = 0; h < collision.length; h ++) {

			
		}
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
