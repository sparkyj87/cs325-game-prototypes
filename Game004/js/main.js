"use strict";

window.onload = function() {

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {
		preload : preload,
		create : create,
		update : update,
		render : render
	});

	function preload() {

		game.load.spritesheet('playerpic', 'assets/sprites/player.png', 32, 48);
		game.load.image('background', 'assets/sprites/background.png');
		game.load.image('bar', 'assets/sprites/bar.png');
		game.load.image('block', 'assets/sprites/block.png');
		game.load.image('platform', 'assets/sprites/platform.png');
		game.load.image('squashed', 'assets/sprites/squashed.png');
		game.load.image('door', 'assets/sprites/door.png');
		game.load.image('energybar', 'assets/sprites/energybar.png');
		game.load.image('energybarouter', 'assets/sprites/energybarouter.png');
		game.load.audio('jump', 'assets/audio/jump.mp3');
		game.load.audio('dead', 'assets/audio/dead.mp3');
		game.load.audio('splat', 'assets/audio/splat.mp3');
		game.load.audio('pass', 'assets/audio/pass.mp3');
		game.load.audio('timeslow', 'assets/audio/timeslow.mp3');
		game.load.audio('timeresume', 'assets/audio/timeresume.mp3');
	}

	var player;
	var facing;
	var jumpTimer = 0;
	var cursors;
	var bars;
	var blocks;
	var start;
	var end;
	var door;
	var alive;
	var style;
	var style2;
	var style3;
	var text;
	var text2;
	var squashed;
	var energyBar;
	var energyBarOuter;
	var deathCause;
	var stage = 1;
	var fx;
	var fx2;
	var fx3;
	var fx4;
	var fxTimeSlow;
	var fxTimeResume;
	var timerText;
	var energy;
	var timeScale;
	var playOnce;
	var doubleJumped = false;
	var readyForDoubleJump = false;
	var tutorialText1;
	var tutorialText2;
	var tutorialText3;

	function create() {

		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.world.setBounds(0,0,3000,600);
		game.add.sprite(0, 0, 'background');

		tutorialText1 = 
			fx = game.add.audio('jump');
		fx2 = game.add.audio('dead');
		fx3 = game.add.audio('splat');
		fx4 = game.add.audio('pass');
		fxTimeSlow = game.add.audio('timeslow');
		fxTimeResume = game.add.audio('timeresume');
		playOnce = false;
		game.physics.arcade.gravity.y = 300;
		facing = 'right';
		bars = game.add.physicsGroup();
		blocks = game.add.physicsGroup();
		squashed = game.add.sprite(3900, 700, 'squashed');
		game.physics.enable(squashed, Phaser.Physics.ARCADE);

		alive = true;
		style = {
				font : "60px Arial",
				fill : "#43d637",
				align : "center"
		};
		style2 = {
				font : "30px Arial",
				fill : "#ffffff",
				align : "center"
		};
		style3 = {
				font : "20px Arial",
				fill : "#ffffff",
				align : "left"
		};
		tutorialText1 = game.add.text(4000, 280, 'Move: L/R arrows', style3);
		tutorialText2 = game.add.text(4000, 300, 'Jump: Up arrow', style3);
		tutorialText3 = game.add.text(4000, 320, 'Slow Time: S key', style3);
		if(stage ==1 ){
			tutorialText1.position.x = 20;
			tutorialText2.position.x = 20;
			tutorialText3.position.x = 20;
		}
		if (stage == 5) {
			text = game.add.text(400, 300, 'Final Stage', style);
		}
		else{
			text = game.add.text(400, 300, 'Stage ' + stage, style);
		}
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
		text2 = game.add.text(400, 200, '', style2);
		text2.anchor.x = 0.5;
		text2.anchor.y = 0.5;
		timerText = game.add.text(400, 40, '', style);
		for (var i = 0; i < 75 + stage * 75; i++) {
			var bar = bars
			.create(Math.round(game.rnd.between(50, 2900) / 50) * 50,
					Math.round(game.rnd.between(0, 500) / 100) * 100,
			'bar');

			var dice = game.rnd.between(1, 2);
			if (dice == 1) {
				bar.body.velocity.y = game.rnd.between(10 + stage * 10,
						60 + stage * 30);
			}
			if (dice == 2) {
				bar.body.velocity.y = game.rnd.between(-(10 + stage * 10),
						-(60 + stage * 30));
			}

			bar.body.allowGravity = false;
			bar.body.immovable = true;
		}
		for (var i = 0; i < 50; i++) {
			var block = blocks.create(Math
					.round(game.rnd.between(100, 2850) / 50) * 50, Math
					.round(game.rnd.between(0, 500) / 50) * 50 + 20, 'block');

			block.body.allowGravity = false;
			block.body.immovable = true;
		}
		door = game.add.sprite(2980, 560, 'door');
		start = game.add.sprite(0, 590, 'platform');
		game.physics.enable(start, Phaser.Physics.ARCADE);
		start.body.allowGravity = false;
		start.body.immovable = true;
		end = game.add.sprite(2950, 590, 'platform');
		game.physics.enable(end, Phaser.Physics.ARCADE);
		end.body.allowGravity = false;
		end.body.immovable = true;

		player = game.add.sprite(3, 540, 'playerpic');
		game.physics.enable(player, Phaser.Physics.ARCADE);

		player.body.collideWorldBounds = true;
		player.body.gravity.y = 1000;
		player.body.maxVelocity.y = 500;
		player.body.setSize(20, 32, 5, 16);

		player.animations.add('left', [ 0, 1, 2, 3 ], 10, true);
		player.animations.add('turn', [ 4 ], 20, true);
		player.animations.add('right', [ 5, 6, 7, 8 ], 10, true);

		player.fixedToCamera = false;
		cursors = game.input.keyboard.createCursorKeys();
		energy = 400;
		timeScale = 1;
		energyBar = game.add.sprite(7, 7, 'energybar');
		game.physics.enable(energyBar, Phaser.Physics.ARCADE);
		energyBar.body.allowGravity = false;
		energyBarOuter = game.add.sprite(5, 5, 'energybarouter');
		game.physics.enable(energyBarOuter, Phaser.Physics.ARCADE);
		energyBarOuter.body.allowGravity = false;
	}

	function update() {

		if(player.body.x > 400) {
			game.camera.x = player.body.x - 400;
		}
		energyBar.body.x = game.camera.x + 7;
		energyBarOuter.body.x = game.camera.x + 5;
		energyBar.scale.setTo(energy/400, 1);
		text.position.x = game.camera.x + 400;
		text2.position.x = game.camera.x + 400;

		game.physics.arcade.collide(bars, player);
		game.physics.arcade.collide(start, player);
		game.physics.arcade.collide(end, player);
		game.physics.arcade.collide(blocks, player);
		bars.forEach(checkPos, this);

		player.body.velocity.x = 0;


		if (!alive && game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			stage = 1;
			game.state.restart();
		}
		if(alive){
			if (game.input.keyboard.isDown(Phaser.Keyboard.S)){
				if(energy <= 0){
					energy = 0;
					if(timeScale == 0.5) {
						fxTimeResume.play();
						bars.forEach(function(bar) {
							bar.body.velocity.y = bar.body.velocity.y * 2;
						}, this);
						player.body.gravity.y = player.body.gravity.y * 2;
						player.body.maxVelocity.y = player.body.maxVelocity.y * 2;
						timeScale = 1;
					}
				}
				if(energy > 0) {
					energy -= 2;
					if(timeScale == 1) {
						bars.forEach(function(bar) {
							fxTimeSlow.play();
							bar.body.velocity.y = bar.body.velocity.y / 2;
						}, this);
						player.body.gravity.y = player.body.gravity.y / 2;
						player.body.maxVelocity.y = player.body.maxVelocity.y / 2;
						timeScale = 0.5;
					}
				}

			}
			else {
				if(timeScale == 0.5) {
					fxTimeResume.play();
					bars.forEach(function(bar) {
						bar.body.velocity.y = bar.body.velocity.y * 2;
					}, this);
					player.body.gravity.y = player.body.gravity.y * 2;
					player.body.maxVelocity.y = player.body.maxVelocity.y * 2;
					timeScale = 1;
				}
				if(energy >= 400){
					energy = 400;
				}
				if(energy < 400) {
					energy++;
				}
			}
		}

		if (cursors.left.isDown) {
			player.body.velocity.x = -150 * timeScale;

			if (facing != 'left') {
				player.animations.play('left');
				facing = 'left';
			}
		} else if (cursors.right.isDown) {

			player.body.velocity.x = 150  * timeScale;

			if (facing != 'right') {
				player.animations.play('right');
				facing = 'right';
			}
		} else {
			if (facing != 'idle') {
				player.animations.stop();

				if (facing == 'left') {
					player.frame = 0;
				} else {
					player.frame = 5;
				}

				facing = 'idle';
			}
		}

		if (!alive)
			playerDeadHandler();

		if (player.body.blocked.right && player.body.touching.down && alive) {

			fx4.play();
			if (stage == 10) {
				playOnce = true;
				alive = false;
				deathCause = "Congratulations! You won! Press Enter to restart.";
				playerDeadHandler();
			} else {
				stage++;
				game.state.restart();
			}
		}

		if (player.body.onFloor()) {
			deathCause = "You are dead. Press Enter to restart.";
			alive = false;
		}

		if (player.body.touching.up) {
			if (player.body.touching.down) {

				if (!playOnce) {
					fx3.play();
					squashed.position.x = player.position.x + 5;
					squashed.position.y = player.position.y - 5;

					squashed.body.velocity.y = 0;
					squashed.body.gravity.y = 1;
				}
				deathCause = "You were crushed. Press Enter to restart.";

				alive = false;
			}
			jumpTimer = 0;
		}

		if (cursors.up.isDown && alive) {
			if ((player.body.touching.down && jumpTimer == 0) || (readyForDoubleJump && !doubleJumped)) {
				jumpTimer = 1;
				fx.play();
				player.body.velocity.y = -400 * timeScale;
				if(readyForDoubleJump) {
					readyForDoubleJump = false;
					doubleJumped = true;
				}
			} else if (jumpTimer > 0 && jumpTimer < 40) {
				jumpTimer = jumpTimer + timeScale;
				player.body.velocity.y = (-400 + (jumpTimer * 12)) * timeScale;
			}
		} else {
			jumpTimer = 0;
		}

		if(!(player.body.touching.down) && cursors.up.isUp) {
			readyForDoubleJump = true;
		}

		if(player.body.touching.down) {
			doubleJumped = false;
			readyForDoubleJump = false;
		}

	}

	function checkPos(bar) {
		if (bar.y > 620 || bar.y < -20) {
			var dice = game.rnd.between(1, 2);
			if (dice == 1) {
				bar.y = -10;
				bar.x = Math.round(game.rnd.between(50, 2900) / 50) * 50;
				bar.body.velocity.y = game.rnd.between(10 + stage * 10,
						60 + stage * 30) * timeScale;
			}
			if (dice == 2) {
				bar.y = 610;
				bar.x = Math.round(game.rnd.between(50, 2900) / 50) * 50;
				bar.body.velocity.y = game.rnd.between(-(10 + stage * 10),
						-(60 + stage * 30)) * timeScale;
			}
		}
		if (game.physics.arcade.overlap(bar, blocks)) {
			bar.body.velocity.y *= -1;
		}

	}

	function playerDeadHandler() {
		player.kill();
		if (!playOnce)
			fx2.play();
		playOnce = true;
		text2.text = deathCause;
	}

	function render() {

		// game.debug.bodyInfo(player, 16, 24);

	}
}
