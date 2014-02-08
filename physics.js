//contains an object which controls the physics constants of the game.

var gamePhysics = {
	//number of circles
	circsPresent: 2,
	//multiplier applie to velocity to slow movement
	surfaceFric: .95,
	//rate of increase for moving shapes
	acceleration: 10,
	//top limit on speed for objects to move
	globalMaxSpeed: 20,
	//top limit for circles
	circMaxSpeed: 10,
	//energy absorbtion by walls
	eAbsorb: -.75,
	//time until random accel choice in milliseconds
	randAccel: 250,
	//min time until circles self destruct
	killTimer: 10000,
	//max value a shape's math value can take
	maxVal: 20
};


