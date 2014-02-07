function animate (shapeArray, context, canvas, confirmedCollisions, lastFrame, physics) {
	var time = ((new Date()).getTime() - lastFrame) / 10000000000000; //miliseconds since last frame
	var cycleNumbers = false;

	//requests next frame right away, in case polyfill is used
	requestAnimationFrame(function() {animate(shapeArray, context, canvas, confirmedCollisions, time, physics)});
	
	//resolves collisions from last frame
	for (var g = 0; g < confirmedCollisions.length; g++) {

		var collision = confirmedCollisions[g];
		if (!(collision[0].targets(collision[1]) || collision[1].targets(collision[0]))) {

		}

/*		else {

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
		}*/
	}
	
	if (cycleNumbers) {

		//assigns new numbers, picks a target and returns the player shape
		var playerShape = newNumbers(shapeArray, canvas, physics);
	
		for (var h = 0; h < shapeArray.length; h++) {

			var reactor = shapeArray[h];
			if (!(reactor.player)) {

				var centVec = new Vec2(reactor.x - playerShape.x, reactor.y - playerShape.y);
				var reactVec = centVec;
				reactVec.normalize();
				reactVec = reactVec.mulS(reactor.maxSpeed);
				reactor.xAccel = reactVec.x;
				reactor.yAccel = reactVec.y;
				console.info("reaction happened?");
			}
		}
	}

	context.clearRect(0, 0, canvas.width, canvas.height);
	confirmedCollisions.length = 0;

	//accelerates shapes, moves them, checks for collisions to resolve next frame, then draws
	//shapes
	for (var i = 0; i < shapeArray.length; i++) {

		var shape = shapeArray[i];
		if (shape.player) {

			var playerShape = shape;
		}

		shape.applyAccel(time);
		shape.move(time, canvas);

		//check for collisions
		for (var j = i + 1; j < shapeArray.length; j++) {

			if (!(shape === shapeArray[j]) && shape.checkCollision(shapeArray[j])) {

				confirmedCollisions.push([shape, shapeArray[j]]);
				
				var shape1 = shape;
				var shape2 = shapeArray[j];

				var collisionNormal = shape1.getNormal(shape2);
				collisionNormal = collisionNormal.abs();
				var shape1Proj = shape1.getProj(collisionNormal, shape2);
				var shape2Proj = shape2.getProj(collisionNormal, shape1);
				var centersVec = new Vec2(shape1.x - shape2.x, shape1.y - shape2.y);
				var centersProj = centersVec.dot(collisionNormal);

				var displacement = Math.abs(shape1Proj) + Math.abs(shape2Proj) - Math.abs(centersProj);
				var displacementVec = collisionNormal.mulS(displacement);
				if (shape1.x <= shape2.x) {

					shape1.x = shape1.x - displacementVec.x;
					shape2.x = shape2.x + displacementVec.x;
				}
				else {
			
					shape1.x = shape1.x + displacementVec.x;
					shape2.x = shape2.x - displacementVec.x;
				}
				if (shape1.y <= shape2.y) {

					shape1.y = shape1.y - displacementVec.y;
					shape2.y = shape2.y + displacementVec.y;
				}
				else {

					shape1.y = shape1.y + displacementVec.y;
					shape2.y = shape2.y - displacementVec.y;
				}
			}
		}

		shape.draw(ctext);

	}

/*	scoreString = "Score: " + playerShape.player.score;
	ctext.font = "12pt Calibri";
	ctext.textAlign = "left";
	ctext.fillStyle = "black";
	ctext.fillText(scoreString, 10, gameCanvas.height - 10);*/
}
