function Point(x_coord, y_coord) {
	//for keeping track of corners

	this.x = x_coord;
	this.y = y_coord;
}

function Shape(xloc, yloc, fillStyle, physics) {
/*super class that contains all shapes in game. includes location
and velocity info, since all objects will have location and some
may move. Also contains fill style and border defaults*/
	//this.x and this.y refer to the center of shapes.
	this.x = xloc;
	this.y = yloc;
	this.origStyle = fillStyle;
	this.fillStyle = this.origStyle;
	this.borderWidth = 1;
	this.xVelocity = 0;
	this.yVelocity = 0;
	this.physics = physics;
	this.collided = false;
	this.doomed = false;
	this.mathValue = 0
	this.mathString = ''
}

Shape.prototype.move = function(time, gameCanvas) {
	/*time is required
	
	changes position of object based on current or
	provided velocity multiplied by time. Also ensures
	that velocity doesn't exceed the physics' maxSpeed
	*/

	if (!((this.xVelocity == 0) && (this.yVelocity == 0))) {

		var linearSpeed = Math.sqrt((this.xVelocity*this.xVelocity) + (this.yVelocity*this.yVelocity));	
		if (linearSpeed >= this.maxSpeed) {
			this.xVelocity /= (linearSpeed / this.maxSpeed);
			this.yVelocity /= (linearSpeed / this.maxSpeed);
		}
	}

	this.x += this.xVelocity * time;
	this.y += this.yVelocity * time;
	
	this.borderAdjust(gameCanvas);
	
	if (this.cnr) {
		this.calcCorners();
	}

}


Shape.prototype.checkCollision = function(other) {
	var axes = this.getAxes(other).concat(other.getAxes(this));
	var projLengthA = 0;
	var projLengthB = 0;
	var centVec;
	var deepestPen = 0;
	var deepestAxis;

	for (var i = 0; i < axes.length; i++) {
		var axis = axes[i];
		projLengthA = this.getProj(axis, other);
		projLengthB = other.getProj(axis, this);

		centVec = new Vec2(this.x - other.x, this.y - other.y);
		centVec = Math.abs(centVec.dot(axis));
		
		if (projLengthA + projLengthB <= centVec) {
			return false;
		}
	}

	
	return true;		
}

Shape.prototype.targets = function(collidedShape) {

	if (this.player) {

		return (collidedShape === this.player.target);
	}
	
	else {

		return false;
	}
}

Shape.prototype.collisionReact = function(normal, otherVec) {

	var normalPerp = new Vec2 (-1 * normal.x, normal.y);
	var otherVelx = otherVec.dot(normal);
	var thisVelVec = new Vec2 (this.xVelocity, this.yVelocity);
	var thisVely = thisVelVec.dot(normalPerp);
	var energyTransVec = normal.mulS(otherVelx);
	
	var newVelVec = normal.mulS(thisVely).addV(energyTransVec).mulS(-1);
	this.xVelocity = -1 * newVelVec.x;
	this.yVelocity = -1 * newVelVec.y;
}

Shape.prototype.getVelVec = function() {

	return new Vec2(this.xVelocity, this.yVelocity);
}
/*

Rectangle is the main game object. It needs to be controllable 
by the player applying acceleration to it which will change the velocity

Inherits from Shape

*/

function Rectangle(xloc, yloc, width, height, fillStyle, physics, keys, keymap, player) {
	Shape.call(this, xloc, yloc, fillStyle, physics);
	this.player = player;
	this.width = width;
	this.height = height;
	this.keys = keys;
	this.cnr = [new Point(xloc - this.width/2, yloc - this.height/2),
		    new Point(xloc + this.width/2, yloc - this.height/2),
		    new Point(xloc + this.width/2, yloc + this.height/2),
		    new Point(xloc - this.width/2, yloc + this.height/2)];
	this.l = keymap[0];
	this.u = keymap[1];
	this.r = keymap[2];
	this.d = keymap[3];
	this.maxSpeed = physics.globalMaxSpeed;
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.draw = function(ctext) {

//draws Rectangle object based on its location, width height
//and coloring info. Requires that the context is passed to it

	ctext.beginPath();
	ctext.rect((this.x - this.width / 2), (this.y - this.height / 2), this.width, this.height);
	ctext.fillStyle = this.fillStyle;
	ctext.fill();
	ctext.lineWidth = this.borderWidth;
	ctext.strokeStyle = "black";
	ctext.stroke();

	ctext.font = '14pt Calibri';
	ctext.textAlign = 'center';
	ctext.fillStyle = 'black';
	ctext.fillText(this.mathString, this.x, this.y);
}



Rectangle.prototype.applyAccel = function(time) {
	var xVel = 0;
	var yVel = 0;
	if (this.keys[this.l]) {
		xVel += this.physics.acceleration * time * -1;
	}
	if (this.keys[this.r]) {
		xVel += this.physics.acceleration * time;
	}
	
	if (this.keys[this.u]) {
		yVel += this.physics.acceleration * time * -1;
	}
	if (this.keys[this.d]) {
		yVel += this.physics.acceleration * time;
	}


	this.xVelocity += xVel;
	this.yVelocity += yVel;
	this.xVelocity *= this.physics.surfaceFric;
	this.yVelocity *= this.physics.surfaceFric;

}
Rectangle.prototype.borderAdjust = function(gameCanvas) {
/*
runs interactions with the border of the playing area for rectangles.
Needs to be differnt than for Circles because of different way of 
calculating the distance from the right/bottom border.

Determines if the rectangle is positioned beyond the border. If so,
repositions the rectangle at the border.
*/

	//deals with x border
	this.xVelocity *= this.physics.eAbsorb;
	if (this.x >= gameCanvas.width - (this.width / 2)) {
		this.x = gameCanvas.width - (this.width / 2);
	}
	else if (this.x <= this.width / 2) {
		this.x = this.width / 2;
	}
	else {
		this.xVelocity /= this.physics.eAbsorb;
	}
	
	//deals with y border
	this.yVelocity *= this.physics.eAbsorb;
	if (this.y >= gameCanvas.height - (this.height / 2)) {
		this.y = gameCanvas.height - (this.height / 2);
	}
	else if (this.y <= this.height / 2) {
		this.y = this.height / 2;
	}
	else {
		this.yVelocity /= this.physics.eAbsorb;
	} 
}

Rectangle.prototype.calcCorners = function() {

	this.cnr = [new Point(this.x - this.width/2, this.y - this.height/2),
		    new Point(this.x + this.width/2, this.y - this.height/2),
		    new Point(this.x + this.width/2, this.y + this.height/2),
		    new Point(this.x - this.width/2, this.y + this.height/2)];

}

Rectangle.prototype.getAxes = function(shape) {

	var rectAxes =  [new Vec2(this.cnr[1].x - this.cnr[0].x, this.cnr[1].y - this.cnr[0].y), new Vec2(this.cnr[3].x - this.cnr[0].x, this.cnr[3].y - this.cnr[0].y)];

	//normalize axis vectors
	for (var i = 0; i < rectAxes.length; i ++) {
		if (!(rectAxes[i].x == 0 && rectAxes[i].y == 0)) {
			rectAxes[i].normalize();
		}
	}

	return rectAxes;

}

Rectangle.prototype.getNormal = function(shape) {

	var normal;
	var region = this.getRegion(shape);
	if (region % 2 == 1) {

		var cornerNum = Math.ceil(region / 2) % 2;
		normal = new Vec2(this.cnr[cornerNum].x - this.cnr[cornerNum + 1].x,
				  this.cnr[cornerNum].y - this.cnr[cornerNum + 1].y);
	}
	else {
	
		normal = new Vec2(this.cnr[region/2].x - shape.x, this.cnr[region/2].y - shape.y);
	}
	normal.normalize();
	return normal;
}

Rectangle.prototype.getRegion = function(shape) {
	//Used in Circle.getAxes
	if (shape.x < this.cnr[0].x) {
		if (shape.y < this.cnr[0].y) {
			return 0;
		}
		if (shape.y >= this.cnr[0].y && shape.y <= this.cnr[3].y) {

			return 7;
		}
		if (shape.y > this.cnr[3].y) {
			return 6;
		}
	}
	if (shape.x >= this.cnr[0].x && shape.x <= this.cnr[1].x) {

		if (shape.y <= this.cnr[0].y) {

			return 1;
		}
		if (shape.y >= this.cnr[3].y) {

			return 5;
		}
		if (shape.y >= (((this.cnr[1].y - this.cnr[3].y) / (this.cnr[1].x - this.cnr[3].x)) * (shape.x - this.x) + this.y)) {

			if (shape.y >= (((this.cnr[0].y - this.cnr[2].y) / (this.cnr[0].x - this.cnr[2].x)) * (shape.x - this.x) + this.y)) {
				return 1;
			}
			else {
				return 7;
			}
		}
		else {
			if (shape.y >= (((this.cnr[0].y - this.cnr[2].y) / (this.cnr[0].x - this.cnr[2].x)) * (shape.x - this.x) + this.y)) {

				return 3;
			}
			else {

				return 5;
			}
		} 
	}
	if (shape.x > this.cnr[1].x) {
		if (shape.y < this.cnr[1].y) {
			return 2;
		}
		if (shape.y >= this.cnr[1].y && shape.y <= this.cnr[2].y) {

			return 3;
		}
		if (shape.y > this.cnr[2].y) {
			return 4;
		}
	}
}

Rectangle.prototype.getProj = function(axis, shape) {

	var minimum = 0;
	var maximum = 0;
	var mincnr;
	var maxcnr;
	var returnVec;

	for (var i = 0; i < this.cnr.length; i++) {
		var tempVec = new Vec2(this.cnr[i].x - this.x, this.cnr[i].y - this.y);
		var tempVal = tempVec.dot(axis);
		if (tempVal <= minimum) {
			minimum = tempVal;
			mincnr = this.cnr[i];
		}
		if (tempVal >= maximum) {
			maximum = tempVal;
			maxcnr = this.cnr[i];
		}
	}

	var centersVec = new Vec2(this.x - shape.x, this.y - shape.y);
	if (centersVec.dot(axis) > 0) {
		returnVec = new Vec2(mincnr.x - this.x, mincnr.y - this.y);
		return Math.abs(returnVec.dot(axis));
	}
	else {
		returnVec = new Vec2(maxcnr.x - this.x, maxcnr.y - this.y);
		return Math.abs(returnVec.dot(axis));
	}
}

/*

Circle is the secondary object in the game. They are animated without
player input.

Inherits from Shape

*/

function Circle(canvas, physics) {
	var xloc = Math.floor(Math.random() * canvas.width);
	var yloc = Math.floor(Math.random() * canvas.height);
	var radius = 35;
	var fillStyle = '#DDDDDD';

	Shape.call(this, xloc, yloc, fillStyle, physics);
	this.radius = radius;
	this.circAccel = 20;
	this.timer = false;
	this.xAccel = 0;
	this.yAccel = 0;
	this.maxSpeed = physics.circMaxSpeed;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.draw = function(ctext) {

//draws Circle based on its location, radius and coloring
//info. Requires that the context is passed to it

	ctext.beginPath();
	ctext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	ctext.fillStyle = this.fillStyle;
	ctext.fill();
	ctext.lineWidth = this.borderWidth;
	ctext.strokeStyle = "black";
	ctext.stroke();

	ctext.font = '12pt Calibri';
	ctext.textAlign = 'center';
	ctext.fillStyle = 'black';
	ctext.fillText(this.mathString, this.x, this.y);
	
}

Circle.prototype.applyAccel = function(time) {
	if (!this.timer) {
		setTimeout(function() {
			var angle = Math.random() * 2 * Math.PI;
	
			this.xAccel = this.circAccel * Math.cos(angle);
			this.yAccel = this.circAccel * Math.sin(angle);
			this.timer = false;
		}.bind(this), Math.random() * this.physics.randAccel + this.physics.randAccel);
		this.timer = true;
	}
	this.xVelocity += this.xAccel * time;
	this.yVelocity += this.yAccel * time;
}

Circle.prototype.borderAdjust = function(gameCanvas) {
/*
runs interactions with the border of the playing area for circles.
Needs to be differnt than for Rects because of different way of 
calculating the distance from the right/bottom border.

Determines if the circle is positioned beyond the border. If so,
repositions the circle at the border.
*/
	//deals with x border
	this.xVelocity *= this.physics.eAbsorb;
	if (this.x >= gameCanvas.width - this.radius) {
		this.x = gameCanvas.width - this.radius;
	}
	else if (this.x <= 0 + this.radius) {
		this.x = 0 + this.radius;
	}
	else {
		this.xVelocity /= this.physics.eAbsorb;
	}
	
	//deals with y border
	this.yVelocity *= this.physics.eAbsorb;
	if (this.y >= gameCanvas.height - this.radius) {
		this.y = gameCanvas.height - this.radius;
	}
	else if (this.y <= 0 + this.radius) {
		this.y = 0 +this.radius;
	}
	else {
		this.yVelocity /= this.physics.eAbsorb;
	}
}

Circle.prototype.getAxes = function(shape) {
	var circVec;

	if (shape instanceof Circle) {
		circVec = new Vec2(this.x - shape.x, this.y - shape.y);
		if (!(circVec.x == 0 && circVec.y == 0)) {
			circVec.normalize();
		}
		return [circVec];
	}
	region = shape.getRegion(this);
	if (region % 2 != 0) {
		return [];
	}
	circVec = new Vec2(shape.cnr[region/2].x - this.x, shape.cnr[region/2].y - this.y);
	if (!(circVec.x == 0 && circVec.y == 0)) {
		circVec.normalize();	
	}
	return [circVec];
}

Circle.prototype.getNormal = function(shape) {
	var normalVec;
	
	if (shape instanceof Circle) {

		normalVec = new Vec2(this.x - shape.x, this.y - shape.y);
		if (!(normalVec.x == 0 && normalVec.y ==0)) {

			normalVec.normalize();
		}
		return normalVec;
	}
	region = shape.getRegion(this);
	if (region % 2 != 0) {

		return null;
	}
	normalVec = new Vec2(shape.cnr[region/2].x - this.x, shape.cnr[region/2].y - this.y);
	if (!(normalVec.x == 0 && normalVec.y == 0)) {

		normalVec.normalize();
	}
	return normalVec;	
}

Circle.prototype.getProj = function(axis, shape) {
	return this.radius;
}

Circle.prototype.doomMe = function() {
	setTimeout(function() {
		this.doomed = true;
	}.bind(this), Math.random() * this.physics.killTimer + this.physics.killTimer);
}	
