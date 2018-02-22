"use strict";

window.onload = function() {

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {
		preload : preload,
		create : create,
		update : update,
		render : render
	});

	function preload() {

		game.load.image('background', 'assets/sprites/background.png');
		game.load.image('board', 'assets/sprites/board.png');
		game.load.image('player1', 'assets/sprites/player1.png');
		game.load.image('player2', 'assets/sprites/player2.png');
		game.load.image('block', 'assets/sprites/block.png');
		game.load.image('netbutton', 'assets/sprites/netbutton.png');
		game.load.image('lassobutton', 'assets/sprites/lassobutton.png');
		game.load.image('lassocancelbutton',
				'assets/sprites/lassocancelbutton.png');
		game.load.image('highlight', 'assets/sprites/highlight.png');
		game.load.image('lasso', 'assets/sprites/lasso.png');
		game.load.image('net', 'assets/sprites/net.png');
		game.load.spritesheet('greenzone', 'assets/sprites/greenzone.png', 50,
				50, 5);
		game.load.spritesheet('redzone', 'assets/sprites/redzone.png', 50, 50,
				5);
		game.load.spritesheet('lassotrail', 'assets/sprites/lassotrail.png',
				30, 30, 7);
		game.load.spritesheet('forcefield', 'assets/sprites/forcefield.png',
				150, 150, 5);
		game.load.audio('button', 'assets/audio/button.mp3');
		game.load.audio('timewarning', 'assets/audio/timewarning.mp3');
		game.load.audio('lassoswing', 'assets/audio/lassoswing.mp3');
		game.load.audio('netmiss', 'assets/audio/netmiss.mp3');
		game.load.audio('nethit', 'assets/audio/nethit.mp3');
		game.load.audio('lassohit', 'assets/audio/lassohit.mp3');
		game.load.audio('ffsound', 'assets/audio/ffsound.mp3');
		game.load.audio('brick', 'assets/audio/brick.mp3');
	}

	var background;
	var board;
	var player1;
	var player2;
	var player1alpha;
	var player2alpha;
	var blocks;
	var p1NetButton;
	var p2NetButton;
	var p1LassoButton;
	var p2LassoButton;
	var p1LassoCancelButton;
	var p2LassoCancelButton;
	var turn;
	var highlight;
	var greenzone;
	var redzone;
	var blockalpha;
	var moved;
	var gameover;
	var text;
	var text2;
	var style;
	var repeat = true;
	var lassoActivate;
	var lasso;
	var net;
	var keys;
	var p1Health;
	var p2Health;
	var p1HealthText;
	var p2HealthText;
	var lassotrail;
	var timer;
	var timerText;
	var remainingTime;
	var forcefield;
	var fxButton;
	var fxTimeWarning;
	var fxLassoSwing;
	var fxNetMiss;
	var fxNetHit;
	var fxLassoHit;
	var fxFFSound;
	var fxBrick;

	function create() {

		game.physics.startSystem(Phaser.Physics.ARCADE);
		fxButton = game.add.audio('button');
		fxTimeWarning = game.add.audio('timewarning');
		fxLassoSwing = game.add.audio('lassoswing');
		fxNetMiss = game.add.audio('netmiss');
		fxNetHit = game.add.audio('nethit');
		fxLassoHit = game.add.audio('lassohit');
		fxFFSound = game.add.audio('ffsound');
		fxBrick = game.add.audio('brick');
		board = game.add.sprite(0, 0, 'board');
		background = game.add.sprite(0, 0, 'background');
		player1 = game.add.sprite(300, 350, 'player1');
		game.physics.enable(player1, Phaser.Physics.ARCADE);
		player2 = game.add.sprite(500, 250, 'player2');
		game.physics.enable(player2, Phaser.Physics.ARCADE);
		player1.anchor.set(0.5);
		player2.anchor.set(0.5);
		player1alpha = game.add.sprite(900, 700, 'player1');
		game.physics.enable(player1alpha, Phaser.Physics.ARCADE);
		player1alpha.anchor.set(0.5);
		player1alpha.alpha = 0.5;
		player2alpha = game.add.sprite(900, 700, 'player2');
		game.physics.enable(player2alpha, Phaser.Physics.ARCADE);
		player2alpha.anchor.set(0.5);
		player2alpha.alpha = 0.5;
		highlight = game.add.sprite(0, 52, 'highlight');
		game.physics.enable(highlight, Phaser.Physics.ARCADE);
		lasso = game.add.sprite(900, 700, 'lasso');
		game.physics.enable(lasso, Phaser.Physics.ARCADE);
		lasso.anchor.set(0.5);
		net = game.add.sprite(900, 700, 'net');
		game.physics.enable(net, Phaser.Physics.ARCADE);
		net.anchor.set(0.5);
		blockalpha = game.add.sprite(900, 700, 'block');
		game.physics.enable(blockalpha, Phaser.Physics.ARCADE);
		blockalpha.anchor.set(0.5);
		blockalpha.alpha = 0.5;
		p1NetButton = game.add.sprite(10, 150, 'netbutton');
		p1NetButton.inputEnabled = true;
		p1NetButton.events.onInputDown.add(netExec1, this);
		p2NetButton = game.add.sprite(690, 150, 'netbutton');
		p2NetButton.inputEnabled = true;
		p2NetButton.events.onInputDown.add(netExec2, this);
		p1LassoButton = game.add.sprite(10, 250, 'lassobutton');
		p1LassoButton.inputEnabled = true;
		p1LassoButton.events.onInputDown.add(lassoExec1, this);
		p2LassoButton = game.add.sprite(690, 250, 'lassobutton');
		p2LassoButton.inputEnabled = true;
		p2LassoButton.events.onInputDown.add(lassoExec2, this);
		p1LassoCancelButton = game.add.sprite(900, 700, 'lassocancelbutton');
		p1LassoCancelButton.inputEnabled = true;
		p1LassoCancelButton.events.onInputDown.add(lassoCancelExec1, this);
		p2LassoCancelButton = game.add.sprite(900, 700, 'lassocancelbutton');
		p2LassoCancelButton.inputEnabled = true;
		p2LassoCancelButton.events.onInputDown.add(lassoCancelExec2, this);
		blocks = game.add.group();
		style = {
			font : "30px Arial",
			fill : "#ffffff",
			align : "center"
		};
		p1Health = 3;
		p2Health = 3;
		p1HealthText = game.add.text(14, 25, '', style);
		p1HealthText.anchor.x = 0;
		p1HealthText.anchor.y = 0.5;
		p2HealthText = game.add.text(786, 25, '', style);
		p2HealthText.anchor.x = 1;
		p2HealthText.anchor.y = 0.5;
		text = game.add.text(400, 250, '', style);
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		timerText = game.add.text(400, 40, '', style);
		timerText.anchor.x = 0.5;
		timerText.anchor.y = 0.5;
		game.input.mouse.capture = true;
		keys = game.input.keyboard.createCursorKeys();
		turn = 1;
		gameover = false;
		lassoActivate = false;
		timer = game.time.create(true);
		timer.add(Phaser.Timer.SECOND * 30, timeUp, this);
	}

	function update() {
		if (timer.running) {
			remainingTime = (30 - Math.round((timer.ms - 500) / 1000));
			if (remainingTime <= 5) {
				if (timer.ms % 1000 > 500) {
					fxTimeWarning.play();
					timerText.addColor("#ff0000", 0);
				} else {
					timerText.addColor("#ffffff", 0);
				}
			} else {
				timerText.addColor("#ffffff", 0);
			}
			timerText.text = 'Timer: ' + remainingTime;
		}
		if (!gameover) {
			if (p1Health == 0) {
				player2Wins();
			}
			if (p2Health == 0) {
				player1Wins();
			}
			var healthCounter = '';
			for (var count = 0; count < p1Health; count++) {
				healthCounter += '$';
			}
			p1HealthText.text = healthCounter;
			healthCounter = '';
			for (var count = 0; count < p2Health; count++) {
				healthCounter += '$';
			}
			p2HealthText.text = healthCounter;
			if (lassoActivate) {
				if (turn == 1) {
					highlight.x = 0;
					highlight.y = 52;
					if (keys.down.isDown) {

						var blockCheck = true;
						var edgeCheck = true;
						var player2Check = true;
						while (blockCheck && edgeCheck && player2Check) {
							blocks.forEach(function(eachBlock) {
								if (lasso.x == eachBlock.x
										&& lasso.y + 50 == eachBlock.y) {
									blockCheck = false;
								}
							}, this);
							if (lasso.x == player2.x && lasso.y == player2.y) {
								player2Check = false;
							}

							if (lasso.y + 50 > 525) {
								edgeCheck = false;
							}

							if (blockCheck && edgeCheck && player2Check) {
								lassotrail = game.add.sprite(lasso.x, lasso.y,
										'lassotrail');
								lassotrail.anchor.set(0.5);
								var trailanim = lassotrail.animations
										.add('zoom');
								lassotrail.animations.play('zoom', 30, false);
								lasso.y += 50;
							}
						}
						fxLassoSwing.play();
						if (!player2Check){
							fxLassoHit.play();
							player1Wins();
						}
					}
					if (keys.up.isDown) {

						var blockCheck = true;
						var edgeCheck = true;
						var player2Check = true;
						while (blockCheck && edgeCheck && player2Check) {
							blocks.forEach(function(eachBlock) {
								if (lasso.x == eachBlock.x
										&& lasso.y - 50 == eachBlock.y) {
									blockCheck = false;
								}
							}, this);
							if (lasso.x == player2.x && lasso.y == player2.y) {
								player2Check = false;
							}

							if (lasso.y - 50 < 75) {
								edgeCheck = false;
							}

							if (blockCheck && edgeCheck && player2Check) {
								lassotrail = game.add.sprite(lasso.x, lasso.y,
										'lassotrail');
								lassotrail.anchor.set(0.5);
								var trailanim = lassotrail.animations
										.add('zoom');
								lassotrail.animations.play('zoom', 30, false);
								lasso.y -= 50;
							}
						}
						fxLassoSwing.play();
						if (!player2Check){
							fxLassoHit.play();
							player1Wins();
						}
					}
					if (keys.left.isDown) {

						var blockCheck = true;
						var edgeCheck = true;
						var player2Check = true;
						while (blockCheck && edgeCheck && player2Check) {
							blocks.forEach(function(eachBlock) {
								if (lasso.x - 50 == eachBlock.x
										&& lasso.y == eachBlock.y) {
									blockCheck = false;
								}
							}, this);
							if (lasso.x == player2.x && lasso.y == player2.y) {
								player2Check = false;
							}

							if (lasso.x - 50 < 125) {
								edgeCheck = false;
							}

							if (blockCheck && edgeCheck && player2Check) {
								lassotrail = game.add.sprite(lasso.x, lasso.y,
										'lassotrail');
								lassotrail.anchor.set(0.5);
								var trailanim = lassotrail.animations
										.add('zoom');
								lassotrail.animations.play('zoom', 30, false);
								lasso.x -= 50;
							}
						}
						fxLassoSwing.play();
						if (!player2Check){
							fxLassoHit.play();
							player1Wins();
						}
					}
					if (keys.right.isDown) {

						var blockCheck = true;
						var edgeCheck = true;
						var player2Check = true;
						while (blockCheck && edgeCheck && player2Check) {
							blocks.forEach(function(eachBlock) {
								if (lasso.x + 50 == eachBlock.x
										&& lasso.y == eachBlock.y) {
									blockCheck = false;
								}
							}, this);
							if (lasso.x == player2.x && lasso.y == player2.y) {
								player2Check = false;
							}

							if (lasso.x + 50 > 675) {
								edgeCheck = false;
							}

							if (blockCheck && edgeCheck && player2Check) {
								lassotrail = game.add.sprite(lasso.x, lasso.y,
										'lassotrail');
								lassotrail.anchor.set(0.5);
								var trailanim = lassotrail.animations
										.add('zoom');
								lassotrail.animations.play('zoom', 30, false);
								lasso.x += 50;
							}
						}
						fxLassoSwing.play();
						if (!player2Check){
							fxLassoHit.play();
							player1Wins();
						}
					}
				}
				if (turn == -1) {
					highlight.x = 679;
					highlight.y = 52;
					if (keys.down.isDown) {

						var blockCheck = true;
						var edgeCheck = true;
						var player1Check = true;
						while (blockCheck && edgeCheck && player1Check) {
							blocks.forEach(function(eachBlock) {
								if (lasso.x == eachBlock.x
										&& lasso.y + 50 == eachBlock.y) {
									blockCheck = false;
								}
							}, this);
							if (lasso.x == player1.x && lasso.y == player1.y) {
								player1Check = false;
							}

							if (lasso.y + 50 > 525) {
								edgeCheck = false;
							}

							if (blockCheck && edgeCheck && player1Check) {
								lassotrail = game.add.sprite(lasso.x, lasso.y,
										'lassotrail');
								lassotrail.anchor.set(0.5);
								var trailanim = lassotrail.animations
										.add('zoom');
								lassotrail.animations.play('zoom', 30, false);
								lasso.y += 50;
							}
						}
						fxLassoSwing.play();
						if (!player1Check){
							fxLassoHit.play();
							player2Wins();
						}
					}
					if (keys.up.isDown) {

						var blockCheck = true;
						var edgeCheck = true;
						var player1Check = true;
						while (blockCheck && edgeCheck && player1Check) {
							blocks.forEach(function(eachBlock) {
								if (lasso.x == eachBlock.x
										&& lasso.y - 50 == eachBlock.y) {
									blockCheck = false;
								}
							}, this);
							if (lasso.x == player1.x && lasso.y == player1.y) {
								player1Check = false;
							}

							if (lasso.y - 50 < 75) {
								edgeCheck = false;
							}

							if (blockCheck && edgeCheck && player1Check) {
								lassotrail = game.add.sprite(lasso.x, lasso.y,
										'lassotrail');
								lassotrail.anchor.set(0.5);
								var trailanim = lassotrail.animations
										.add('zoom');
								lassotrail.animations.play('zoom', 30, false);
								lasso.y -= 50;
							}
						}
						fxLassoSwing.play();
						if (!player1Check){
							fxLassoHit.play();
							player2Wins();
						}
							
					}
					if (keys.left.isDown) {

						var blockCheck = true;
						var edgeCheck = true;
						var player1Check = true;
						while (blockCheck && edgeCheck && player1Check) {
							blocks.forEach(function(eachBlock) {
								if (lasso.x - 50 == eachBlock.x
										&& lasso.y == eachBlock.y) {
									blockCheck = false;
								}
							}, this);
							if (lasso.x == player1.x && lasso.y == player1.y) {
								player1Check = false;
							}

							if (lasso.x - 50 < 125) {
								edgeCheck = false;
							}

							if (blockCheck && edgeCheck && player1Check) {
								lassotrail = game.add.sprite(lasso.x, lasso.y,
										'lassotrail');
								lassotrail.anchor.set(0.5);
								var trailanim = lassotrail.animations
										.add('zoom');
								lassotrail.animations.play('zoom', 30, false);
								lasso.x -= 50;
							}
						}
						fxLassoSwing.play();
						if (!player1Check){
							fxLassoHit.play();
							player2Wins();
						}
					}
					if (keys.right.isDown) {

						var blockCheck = true;
						var edgeCheck = true;
						var player1Check = true;
						while (blockCheck && edgeCheck && player1Check) {
							blocks.forEach(function(eachBlock) {
								if (lasso.x + 50 == eachBlock.x
										&& lasso.y == eachBlock.y) {
									blockCheck = false;
								}
							}, this);
							if (lasso.x == player1.x && lasso.y == player1.y) {
								player1Check = false;
							}

							if (lasso.x + 50 > 675) {
								edgeCheck = false;
							}

							if (blockCheck && edgeCheck && player1Check) {
								lassotrail = game.add.sprite(lasso.x, lasso.y,
										'lassotrail');
								lassotrail.anchor.set(0.5);
								var trailanim = lassotrail.animations
										.add('zoom');
								lassotrail.animations.play('zoom', 30, false);
								lasso.x += 50;
							}
						}
						fxLassoSwing.play();
						if (!player1Check){
							fxLassoHit.play();
							player2Wins();
						}
					}
				}
			} else {
				if (turn == 1) {
					highlight.x = 0;
					highlight.y = 52;
					p1NetButton.alpha = 1;
					p1LassoButton.alpha = 1;
					p2NetButton.alpha = 0.2;
					p2LassoButton.alpha = 0.2;
					if (insideBoard()) {
						if (nearP1() && !moved) {
							player1alpha.x = Math
									.floor((game.input.mousePointer.x + 25) / 50) * 50;
							player1alpha.y = Math
									.floor((game.input.mousePointer.y + 25) / 50) * 50;

						} else {
							player1alpha.x = 900;
							player1alpha.y = 700;
						}
						if (p1BlockRange() && p2BlockRange()
								&& blockBlockRange()) {
							blockalpha.x = Math
									.floor((game.input.mousePointer.x + 25) / 50) * 50;
							blockalpha.y = Math
									.floor((game.input.mousePointer.y + 25) / 50) * 50;
						} else {
							blockalpha.x = 900;
							blockalpha.y = 700;
						}
					} else {
						player1alpha.x = 900;
						player1alpha.y = 700;
						blockalpha.x = 900;
						blockalpha.y = 700;
					}
				}
				if (turn == -1) {
					highlight.x = 679;
					highlight.y = 52;
					p1NetButton.alpha = 0.2;
					p1LassoButton.alpha = 0.2;
					p2NetButton.alpha = 1;
					p2LassoButton.alpha = 1;
					if (insideBoard()) {
						if (nearP2() && !moved) {
							player2alpha.x = Math
									.floor((game.input.mousePointer.x + 25) / 50) * 50;
							player2alpha.y = Math
									.floor((game.input.mousePointer.y + 25) / 50) * 50;

						} else {
							player2alpha.x = 900;
							player2alpha.y = 700;
						}
						if (p1BlockRange() && p2BlockRange()
								&& blockBlockRange()) {
							blockalpha.x = Math
									.floor((game.input.mousePointer.x + 25) / 50) * 50;
							blockalpha.y = Math
									.floor((game.input.mousePointer.y + 25) / 50) * 50;
						} else {
							blockalpha.x = 900;
							blockalpha.y = 700;
						}
					} else {
						player2alpha.x = 900;
						player2alpha.y = 700;
						blockalpha.x = 900;
						blockalpha.y = 700;
					}
				}

				if (game.input.activePointer.leftButton.isDown) {
					if (blockalpha.x != 900) {
						var b = blocks
								.create(
										Math
												.floor((game.input.mousePointer.x + 25) / 50) * 50,
										Math
												.floor((game.input.mousePointer.y + 25) / 50) * 50,
										'block');
						game.physics.enable(b, Phaser.Physics.ARCADE);
						b.anchor.set(0.5);
						fxBrick.play();
						moved = false;
						timer.destroy();
						timer = game.time.create(true);
						timer.add(Phaser.Timer.SECOND * 30, timeUp, this);
						timer.start();
						turn *= -1;
					}
					if (player1alpha.x != 900) {
						player1.x = Math
								.floor((game.input.mousePointer.x + 25) / 50) * 50;
						player1.y = Math
								.floor((game.input.mousePointer.y + 25) / 50) * 50;
						repeat = true;
						while (repeat) {
							repeat = false;
							checkProximity();
						}
						moved = true;
					}
					if (player2alpha.x != 900) {
						player2.x = Math
								.floor((game.input.mousePointer.x + 25) / 50) * 50;
						player2.y = Math
								.floor((game.input.mousePointer.y + 25) / 50) * 50;
						repeat = true;
						while (repeat) {
							repeat = false;
							checkProximity();
						}
						moved = true;
					}
				}
			}
		} else {
			timer.stop();
			p1NetButton.alpha = 0.2;
			p1LassoButton.alpha = 0.2;
			p2NetButton.alpha = 0.2;
			p2LassoButton.alpha = 0.2;
			p1LassoCancelButton.x = 900;
			p1LassoCancelButton.y = 700;
			p2LassoCancelButton.x = 900;
			p2LassoCancelButton.y = 700;
			if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
				game.state.restart();
			}

		}
	}

	function insideBoard() {
		if (game.input.mousePointer.x > 125 && game.input.mousePointer.x < 675
				&& game.input.mousePointer.y > 75
				&& game.input.mousePointer.y < 525)
			return true;
		return false;
	}

	function nearP1() {
		if (game.input.mousePointer.x > player1.x - 75
				&& game.input.mousePointer.x < player1.x + 75
				&& game.input.mousePointer.y > player1.y - 75
				&& game.input.mousePointer.y < player1.y + 75
				&& !(game.input.mousePointer.x > player1.x - 25
						&& game.input.mousePointer.x < player1.x + 25
						&& game.input.mousePointer.y > player1.y - 25 && game.input.mousePointer.y < player1.y + 25)) {
			return true;
		}
		return false;
	}

	function nearP2() {
		if (game.input.mousePointer.x > player2.x - 75
				&& game.input.mousePointer.x < player2.x + 75
				&& game.input.mousePointer.y > player2.y - 75
				&& game.input.mousePointer.y < player2.y + 75
				&& !(game.input.mousePointer.x > player2.x - 25
						&& game.input.mousePointer.x < player2.x + 25
						&& game.input.mousePointer.y > player2.y - 25 && game.input.mousePointer.y < player2.y + 25)) {
			return true;
		}
		return false;
	}

	function p1BlockRange() {
		if (game.input.mousePointer.x < player1.x - 75
				|| game.input.mousePointer.x > player1.x + 75
				|| game.input.mousePointer.y < player1.y - 75
				|| game.input.mousePointer.y > player1.y + 75)
			return true;
		return false;
	}

	function p2BlockRange() {
		if (game.input.mousePointer.x < player2.x - 75
				|| game.input.mousePointer.x > player2.x + 75
				|| game.input.mousePointer.y < player2.y - 75
				|| game.input.mousePointer.y > player2.y + 75)
			return true;
		return false;
	}

	function blockBlockRange() {
		var test = true;
		blocks.forEach(function(eachBlock) {
			if (game.input.mousePointer.x > eachBlock.x - 75
					&& game.input.mousePointer.x < eachBlock.x + 75
					&& game.input.mousePointer.y > eachBlock.y - 75
					&& game.input.mousePointer.y < eachBlock.y + 75)
				test = false;
		}, this);
		return test;
	}

	function checkProximity() {
		blocks
				.forEach(
						function(eachBlock) {
							if ((eachBlock.x > player1.x - 80
									&& eachBlock.x < player1.x + 80
									&& eachBlock.y > player1.y - 80 && eachBlock.y < player1.y + 80)
									|| (eachBlock.x > player2.x - 80
											&& eachBlock.x < player2.x + 80
											&& eachBlock.y > player2.y - 80 && eachBlock.y < player2.y + 80)) {
								var sourceX = 0;
								var sourceY = 0;
								if (turn == 1) {
									sourceX = player1.x;
									sourceY = player1.y;
								} else {
									sourceX = player2.x;
									sourceY = player2.y;
								}

								forcefield = game.add.sprite(sourceX, sourceY,
										'forcefield');
								forcefield.anchor.set(0.5);
								var forceanim = forcefield.animations
										.add('boom');
								forcefield.animations.play('boom', 30, false);
								fxFFSound.play();
								eachBlock.destroy();
								repeat = true;
							}
						}, this);
		if (player2.x > player1.x - 80 && player2.x < player1.x + 80
				&& player2.y > player1.y - 80 && player2.y < player1.y + 80
				&& turn == 1) {
			forcefield = game.add.sprite(player1.x, player1.y, 'forcefield');
			forcefield.anchor.set(0.5);
			var forceanim = forcefield.animations.add('boom');
			forcefield.animations.play('boom', 30, false);
			fxFFSound.play();
			player2.destroy();
			player1Wins();
		}

		else if (player1.x > player2.x - 80 && player1.x < player2.x + 80
				&& player1.y > player2.y - 80 && player1.y < player2.y + 80
				&& turn == -1) {
			forcefield = game.add.sprite(player2.x, player2.y, 'forcefield');
			forcefield.anchor.set(0.5);
			var forceanim = forcefield.animations.add('boom');
			forcefield.animations.play('boom', 30, false);
			fxFFSound.play();
			player1.destroy();
			player2Wins();
		}

	}

	function player1Wins() {

		text.text = 'Player 1 wins! Press Enter to restart';
		gameover = true;
	}

	function player2Wins() {

		text.text = 'Player 2 wins! Press Enter to restart';
		gameover = true;
	}

	function lassoExec1() {
		if (!lassoActivate && !gameover && turn == 1) {
			fxButton.play();
			lassoActivate = true;

			lasso.x = player1.x;
			lasso.y = player1.y;
			p1LassoCancelButton.x = p1LassoButton.x;
			p1LassoCancelButton.y = p1LassoButton.y;

		}

	}

	function lassoExec2() {
		if (!lassoActivate && !gameover && turn == -1) {
			fxButton.play();
			lassoActivate = true;

			lasso.x = player2.x;
			lasso.y = player2.y;
			p2LassoCancelButton.x = p2LassoButton.x;
			p2LassoCancelButton.y = p2LassoButton.y;

		}

	}

	function lassoCancelExec1() {
		if (lassoActivate && !gameover && turn == 1) {
			fxButton.play();
			lassoActivate = false;

			lasso.x = 900;
			lasso.y = 700;
			p1LassoCancelButton.x = 900;
			p1LassoCancelButton.y = 700;
			p1Health--;

		}
	}

	function lassoCancelExec2() {
		if (lassoActivate && !gameover && turn == -1) {
			fxButton.play();
			lassoActivate = false;

			lasso.x = 900;
			lasso.y = 700;
			p2LassoCancelButton.x = 900;
			p2LassoCancelButton.y = 700;
			p2Health--;

		}
	}

	function netExec1() {
		if (!gameover && turn == 1) {
			var caught = true;
			var blockCheck = true;
			var edgeCheck = true;
			blocks.forEach(function(eachBlock) {
				if (eachBlock.x > player2.x - 175
						&& eachBlock.x < player2.x - 75
						&& eachBlock.y == player2.y) {
					blockCheck = false;
				}
			}, this);
			if (player2.x - 150 < 125) {
				edgeCheck = false;
			}
			if (blockCheck && edgeCheck) {
				var count = 50;
				while (count < 200) {
					if (player2.x - count > 125) {
						redzone = game.add.sprite(player2.x - count, player2.y,
								'redzone');
						redzone.anchor.set(0.5);
						var redanim = redzone.animations.add('red');
						redzone.animations.play('red', 10, false);
					}
					count += 50;
				}
			} else {
				var count = 50;
				while (count < 200) {
					if (player2.x - count > 125) {
						greenzone = game.add.sprite(player2.x - count,
								player2.y, 'greenzone');
						greenzone.anchor.set(0.5);
						var greenanim = greenzone.animations.add('green');
						greenzone.animations.play('green', 10, false);
					}
					count += 50;
				}
			}
			caught = caught && !(blockCheck && edgeCheck);
			blockCheck = true;
			edgeCheck = true;
			blocks.forEach(function(eachBlock) {
				if (eachBlock.y > player2.y - 175
						&& eachBlock.y < player2.y - 75
						&& eachBlock.x == player2.x) {
					blockCheck = false;
				}
			}, this);
			if (player2.y - 150 < 75) {
				edgeCheck = false;
			}
			if (blockCheck && edgeCheck) {
				var count = 50;
				while (count < 200) {
					if (player2.y - count > 75) {
						redzone = game.add.sprite(player2.x, player2.y - count,
								'redzone');
						redzone.anchor.set(0.5);
						var redanim = redzone.animations.add('red');
						redzone.animations.play('red', 10, false);
					}
					count += 50;
				}
			} else {
				var count = 50;
				while (count < 200) {
					if (player2.y - count > 75) {
						greenzone = game.add.sprite(player2.x, player2.y
								- count, 'greenzone');
						greenzone.anchor.set(0.5);
						var greenanim = greenzone.animations.add('green');
						greenzone.animations.play('green', 10, false);
					}
					count += 50;
				}
			}
			caught = caught && !(blockCheck && edgeCheck);
			blockCheck = true;
			edgeCheck = true;
			blocks.forEach(function(eachBlock) {
				if (eachBlock.x < player2.x + 175
						&& eachBlock.x > player2.x + 75
						&& eachBlock.y == player2.y) {
					blockCheck = false;
				}
			}, this);
			if (player2.x + 150 > 675) {
				edgeCheck = false;
			}
			if (blockCheck && edgeCheck) {
				var count = 50;
				while (count < 200) {
					if (player2.x + count < 675) {
						redzone = game.add.sprite(player2.x + count, player2.y,
								'redzone');
						redzone.anchor.set(0.5);
						var redanim = redzone.animations.add('red');
						redzone.animations.play('red', 10, false);
					}
					count += 50;
				}
			} else {
				var count = 50;
				while (count < 200) {
					if (player2.x + count < 675) {
						greenzone = game.add.sprite(player2.x + count,
								player2.y, 'greenzone');
						greenzone.anchor.set(0.5);
						var greenanim = greenzone.animations.add('green');
						greenzone.animations.play('green', 10, false);
					}
					count += 50;
				}
			}
			caught = caught && !(blockCheck && edgeCheck);
			blockCheck = true;
			edgeCheck = true;
			blocks.forEach(function(eachBlock) {
				if (eachBlock.y < player2.y + 175
						&& eachBlock.y > player2.y + 75
						&& eachBlock.x == player2.x) {
					blockCheck = false;
				}
			}, this);
			if (player2.y + 150 > 525) {
				edgeCheck = false;
			}
			if (blockCheck && edgeCheck) {
				var count = 50;
				while (count < 200) {
					if (player2.y + count < 525) {
						redzone = game.add.sprite(player2.x, player2.y + count,
								'redzone');
						redzone.anchor.set(0.5);
						var redanim = redzone.animations.add('red');
						redzone.animations.play('red', 10, false);
					}
					count += 50;
				}
			} else {
				var count = 50;
				while (count < 200) {
					if (player2.y + count < 525) {
						greenzone = game.add.sprite(player2.x, player2.y
								+ count, 'greenzone');
						greenzone.anchor.set(0.5);
						var greenanim = greenzone.animations.add('green');
						greenzone.animations.play('green', 10, false);
					}
					count += 50;
				}
			}
			caught = caught && !(blockCheck && edgeCheck);
			if (caught) {
				fxNetHit.play();
				net.x = player2.x;
				net.y = player2.y;
				player1Wins();
			} else {
				fxNetMiss.play();
				p1Health--;
			}

		}

	}

	function netExec2() {
		if (!gameover && turn == -1) {
			var caught = true;
			var blockCheck = true;
			var edgeCheck = true;
			blocks.forEach(function(eachBlock) {
				if (eachBlock.x > player1.x - 175
						&& eachBlock.x < player1.x - 75
						&& eachBlock.y == player1.y) {
					blockCheck = false;
				}
			}, this);
			if (player1.x - 150 < 125) {
				edgeCheck = false;
			}
			if (blockCheck && edgeCheck) {
				var count = 50;
				while (count < 200) {
					if (player1.x - count > 125) {
						redzone = game.add.sprite(player1.x - count, player1.y,
								'redzone');
						redzone.anchor.set(0.5);
						var redanim = redzone.animations.add('red');
						redzone.animations.play('red', 10, false);
					}
					count += 50;
				}
			} else {
				var count = 50;
				while (count < 200) {
					if (player1.x - count > 125) {
						greenzone = game.add.sprite(player1.x - count,
								player1.y, 'greenzone');
						greenzone.anchor.set(0.5);
						var greenanim = greenzone.animations.add('green');
						greenzone.animations.play('green', 10, false);
					}
					count += 50;
				}
			}
			caught = caught && !(blockCheck && edgeCheck);
			blockCheck = true;
			edgeCheck = true;
			blocks.forEach(function(eachBlock) {
				if (eachBlock.y > player1.y - 175
						&& eachBlock.y < player1.y - 75
						&& eachBlock.x == player1.x) {
					blockCheck = false;
				}
			}, this);
			if (player1.y - 150 < 75) {
				edgeCheck = false;
			}
			if (blockCheck && edgeCheck) {
				var count = 50;
				while (count < 200) {
					if (player1.y - count > 75) {
						redzone = game.add.sprite(player1.x, player1.y - count,
								'redzone');
						redzone.anchor.set(0.5);
						var redanim = redzone.animations.add('red');
						redzone.animations.play('red', 10, false);
					}
					count += 50;
				}
			} else {
				var count = 50;
				while (count < 200) {
					if (player1.y - count > 75) {
						greenzone = game.add.sprite(player1.x, player1.y
								- count, 'greenzone');
						greenzone.anchor.set(0.5);
						var greenanim = greenzone.animations.add('green');
						greenzone.animations.play('green', 10, false);
					}
					count += 50;
				}
			}
			caught = caught && !(blockCheck && edgeCheck);
			blockCheck = true;
			edgeCheck = true;
			blocks.forEach(function(eachBlock) {
				if (eachBlock.x < player1.x + 175
						&& eachBlock.x > player1.x + 75
						&& eachBlock.y == player1.y) {
					blockCheck = false;
				}
			}, this);
			if (player1.x + 150 > 675) {
				edgeCheck = false;
			}
			if (blockCheck && edgeCheck) {
				var count = 50;
				while (count < 200) {
					if (player1.x + count < 675) {
						redzone = game.add.sprite(player1.x + count, player1.y,
								'redzone');
						redzone.anchor.set(0.5);
						var redanim = redzone.animations.add('red');
						redzone.animations.play('red', 10, false);
					}
					count += 50;
				}
			} else {
				var count = 50;
				while (count < 200) {
					if (player1.x + count < 675) {
						greenzone = game.add.sprite(player1.x + count,
								player1.y, 'greenzone');
						greenzone.anchor.set(0.5);
						var greenanim = greenzone.animations.add('green');
						greenzone.animations.play('green', 10, false);
					}
					count += 50;
				}
			}
			caught = caught && !(blockCheck && edgeCheck);
			blockCheck = true;
			edgeCheck = true;
			blocks.forEach(function(eachBlock) {
				if (eachBlock.y < player1.y + 175
						&& eachBlock.y > player1.y + 75
						&& eachBlock.x == player1.x) {
					blockCheck = false;
				}
			}, this);
			if (player1.y + 150 > 525) {
				edgeCheck = false;
			}
			if (blockCheck && edgeCheck) {
				var count = 50;
				while (count < 200) {
					if (player1.y + count < 525) {
						redzone = game.add.sprite(player1.x, player1.y + count,
								'redzone');
						redzone.anchor.set(0.5);
						var redanim = redzone.animations.add('red');
						redzone.animations.play('red', 10, false);
					}
					count += 50;
				}
			} else {
				var count = 50;
				while (count < 200) {
					if (player1.y + count < 525) {
						greenzone = game.add.sprite(player1.x, player1.y
								+ count, 'greenzone');
						greenzone.anchor.set(0.5);
						var greenanim = greenzone.animations.add('green');
						greenzone.animations.play('green', 10, false);
					}
					count += 50;
				}
			}
			caught = caught && !(blockCheck && edgeCheck);
			if (caught) {
				fxNetHit.play();
				net.x = player1.x;
				net.y = player1.y;
				player2Wins();
			} else {
				fxNetMiss.play();
				p2Health--;
			}
		}

	}

	function timeUp() {
		if (turn == 1)
			player2Wins();
		if (turn == -1)
			player1Wins();
	}

	function render() {

	}
}
