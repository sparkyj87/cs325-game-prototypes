
"use strict";

window.onload = function() {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
		preload : preload,
		create : create,
		update : update
	});

	function preload() {

		game.load.image('car', 'assets/sprites/car.png');
		game.load.image('start', 'assets/sprites/start.png');
		game.load.image('end', 'assets/sprites/end.png');
		game.load.image('touchdown', 'assets/sprites/touchdown.png');
		game.load.image('background', 'assets/sprites/background.png');
		game.load.spritesheet('explode', 'assets/sprites/explode.png', 64, 64,
				25);
		game.load.spritesheet('spinner', 'assets/sprites/bomb.png', 32, 32);
		game.load.audio('explode', 'assets/audio/explode.mp3');
		game.load.audio('cheer', 'assets/audio/cheer.mp3');
		game.load.audio('goal', 'assets/audio/goal.mp3');

	}

	var car;
	var sprites;
	var start;
	var end;
	var cursors;
	var touchdown;
	var text;
	var text2;
	var style;
	var alive;
	var explode;
	var explode2;
	var stage = 1;
	var fx;
	var fx2;
	var fx3;
	var victory;

	function create() {

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.add.sprite(0, 0, 'background');
		fx = game.add.audio('explode');
		fx2 = game.add.audio('cheer');
		fx3 = game.add.audio('goal');

		sprites = game.add.group();
		victory = false;

		for (var i = 0; i < Math.floor(stage / 5) * 5 + 5; i++) {
			var s = sprites.create(game.rnd.integerInRange(100, 700), game.rnd
					.integerInRange(10, 550), 'spinner');
			s.animations.add('spin', [ 0, 1, 2, 3 ]);
			s.play('spin', 20, true);
			game.physics.enable(s, Phaser.Physics.ARCADE);
			s.body.velocity.x = game.rnd.integerInRange(-1 * stage % 5 * 40
					- 30, stage % 5 * 40 + 30);
			s.body.velocity.y = game.rnd.integerInRange(-1 * stage % 5 * 40
					- 30, stage % 5 * 40 + 30);
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
		car.body.drag.set(100);
		car.body.maxVelocity.set(200);

		style = {
			font : "30px Arial",
			fill : "#ffffff",
			align : "center"
		};
		text = game.add.text(400, 100, 'Hole ' + stage, style);
		text2 = game.add.text(400, 200, '', style);
		game.time.events.add(2000, function() {
			game.add.tween(text).to({
				y : 0
			}, 1500, Phaser.Easing.Linear.None, true);
			game.add.tween(text).to({
				alpha : 0
			}, 1500, Phaser.Easing.Linear.None, true);
		}, this);
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		text2.anchor.x = 0.5;
		text2.anchor.y = 0.5;

		cursors = game.input.keyboard.createCursorKeys();
		alive = true;
	}

	function update() {

		game.physics.arcade.collide(sprites);
		game.physics.arcade.collide(start, sprites);
		game.physics.arcade.collide(end, sprites);

		if (game.physics.arcade.overlap(car, touchdown)) {
			if (stage == 18) {
				car.kill()
				victory = true;
				fx2.play();
				text2.text = 'You won! Press space to restart';
			} else {
				fx3.play();
				nextLevel();
			}

		}

		game.physics.arcade
				.overlap(car, sprites, playerDeadHandler, null, this);

		if (!alive) {
			text2.text = 'You are dead. Press Space to restart';
		}

		car.body.angularVelocity = 0;

		if ((!alive || victory)
				&& game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			stage = 1;
			game.state.restart();
		}
		if (cursors.left.isDown) {
			car.body.angularVelocity = -200;
		} else if (cursors.right.isDown) {
			car.body.angularVelocity = 200;
		}

		if (cursors.up.isDown) {
			game.physics.arcade.accelerationFromRotation(car.rotation, 200,
					car.body.acceleration);
		} else if (cursors.down.isDown) {
			game.physics.arcade.accelerationFromRotation(car.rotation, -200,
					car.body.acceleration);
		} else {
			car.body.acceleration.set(0);
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
		fx.play();
		alive = false;
	}

	function nextLevel() {
		stage++;
		game.state.restart();
	}
}