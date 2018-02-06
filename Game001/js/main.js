var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
	preload : preload,
	create : create,
	update : update
});

function preload() {

	game.load.image('car', 'assets/sprites/car90.png');
	game.load.image('start', 'assets/sprites/start.png');
	game.load.image('end', 'assets/sprites/end.png');
	game.load.image('touchdown', 'assets/sprites/touchdown.png');
	game.load.image('starbg', 'assets/sprites/starbg.png');
	game.load.spritesheet('explode', 'assets/sprites/explode.png', 64, 64, 25);
	game.load.spritesheet('spinner', 'assets/sprites/bluemetal_32x32x4.png',
			32, 32);
	game.load.audio('explode', 'assets/audio/explode.mp3');

}

var car;
var sprites;
var start;
var end;
var cursors;
var touchdown;
var text;
var style;
var alive;
var explode;
var explode2;

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.add.sprite(0, 0, 'starbg');
	fx = game.add.audio('explode');
	fx.addMarker('explodesound', 0, 2);
	sprites = game.add.group();

	for (var i = 0; i < 10; i++) {
		var s = sprites.create(game.rnd.integerInRange(100, 700), game.rnd
				.integerInRange(10, 550), 'spinner');
		s.animations.add('spin', [ 0, 1, 2, 3 ]);
		s.play('spin', 20, true);
		game.physics.enable(s, Phaser.Physics.ARCADE);
		s.body.velocity.x = game.rnd.integerInRange(-100, 100);
		s.body.velocity.y = game.rnd.integerInRange(-100, 100);
	}

	sprites.setAll('body.collideWorldBounds', true);
	sprites.setAll('body.bounce.x', 1);
	sprites.setAll('body.bounce.y', 1);
	sprites.setAll('body.minBounceVelocity', 0);

	start = game.add.sprite(0, 270, 'start');
	start.name = 'start';
	start.anchor.set(0);
	game.physics.enable(start, Phaser.Physics.ARCADE);
	start.body.immovable = true;

	touchdown = game.add.sprite(780, 300, 'touchdown');
	game.physics.enable(touchdown, Phaser.Physics.ARCADE);
	touchdown.body.immovable = true;
	touchdown.anchor.set(0.5);

	end = game.add.sprite(740, 270, 'end');
	end.name = 'end';
	end.anchor.set(0);
	game.physics.enable(end, Phaser.Physics.ARCADE);
	end.body.immovable = true;

	car = game.add.sprite(20, 300, 'car');
	car.name = 'car';
	car.anchor.set(0.5);

	game.physics.enable(car, Phaser.Physics.ARCADE);

	car.body.collideWorldBounds = true;
	car.body.bounce.set(0.8);
	car.body.allowRotation = true;
	car.body.immovable = true;

	style = {
		font : "65px Arial",
		fill : "#ffffff",
		align : "center"
	};
	text = game.add.text(10, 10, 'Land on the right platform', style);

	cursors = game.input.keyboard.createCursorKeys();
	alive=true;
}

function update() {

	game.physics.arcade.collide(sprites);
	game.physics.arcade.collide(start, sprites);
	game.physics.arcade.collide(end, sprites);
	
	if (!alive && cursors.down.isDown) {
		game.state.restart();
	}
	
	if (game.physics.arcade.overlap(car, touchdown)) {
		nextLevel();
	} else {
		text.text = 'Land on the right platform';
	}
	

	game.physics.arcade.overlap(car, sprites, playerDeadHandler, null, this);

	car.body.velocity.x = 0;
	car.body.velocity.y = 0;
	car.body.angularVelocity = 0;

	if (cursors.left.isDown) {
		car.body.angularVelocity = -200;
	} else if (cursors.right.isDown) {
		car.body.angularVelocity = 200;
	}

	if (cursors.up.isDown) {
		car.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(
				car.angle, 300));
	}

	if (cursors.down.isDown) {
		car.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(
				car.angle, -300));
	}

}

function playerDeadHandler(carr, sprite) {
	carr.kill();
	sprite.kill();
	explode = game.add.sprite(car.body.x, car.body.y, 'explode');
	explode.anchor.set(0.5);
	explode2 = game.add.sprite(sprite.body.x, sprite.body.y, 'explode');
	explode2.anchor.set(0.5);
	var explosion = explode.animations.add('boom');
	var explosion2 = explode2.animations.add('boom2');
	explode.animations.play('boom', 30, false);
	explode2.animations.play('boom2', 30, false);
	fx.play('explodesound');
	text.text = 'You are dead';
	alive=false;
}

function nextLevel() {
	car.reset(20,300);
	car.angle = 0;
	for (var i = 0; i < 10; i++) {
		var s = sprites.create(game.rnd.integerInRange(100, 700), game.rnd
				.integerInRange(10, 550), 'spinner');
		s.animations.add('spin', [ 0, 1, 2, 3 ]);
		s.play('spin', 20, true);
		game.physics.enable(s, Phaser.Physics.ARCADE);
		s.body.velocity.x = game.rnd.integerInRange(-100, 100);
		s.body.velocity.y = game.rnd.integerInRange(-100, 100);
		sprites.setAll('body.collideWorldBounds', true);
		sprites.setAll('body.bounce.x', 1);
		sprites.setAll('body.bounce.y', 1);
		sprites.setAll('body.minBounceVelocity', 0);
	}
	
}