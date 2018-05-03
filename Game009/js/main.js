
"use strict";

window.onload = function() {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
		preload : preload,
		create : create,
		update : update
	});

	function preload() {
		game.load.image('background', 'assets/sprites/background.png');
		game.load.image('block', 'assets/sprites/block.png');
		game.load.image('ground', 'assets/sprites/ground.png');
		game.load.image('player', 'assets/sprites/player.png');
		game.load.spritesheet('explode', 'assets/sprites/explode.png', 64, 64,
				25);
		game.load.audio('explode', 'assets/audio/explode.mp3');
	}

	var blocks;
	var wallblock;
	var player;
	var facing;
	var cursors;
	var jumpTimer = 0;
	var alive;
	var readyForDoubleJump = false;
	var doubleJumped = false;
	var playOnce;
	var ground;
	var timer;
	var style;
	var text;
	var explode;
	var fx;

	function create() {
		fx = game.add.audio('explode');
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.add.sprite(0, 0, 'background');
		blocks = game.add.physicsGroup();
	    game.physics.enable(blocks, Phaser.Physics.ARCADE);
		player = game.add.sprite(400, 550, 'player');
		player.anchor.set(0.5);
		game.physics.enable(player, Phaser.Physics.ARCADE);
		style = {
				font : "30px Arial",
				fill : "#ffffff",
				align : "center"
			};
		text = game.add.text(400, 300, '', style);
		text.anchor.set(0.5);
		
		cursors = game.input.keyboard.createCursorKeys();
		playOnce = false;
		alive = true;
		timer = 1;
	}
	function update() {
		
		if(game.physics.arcade.overlap(player, blocks)){
			fx.play();
			player.kill();
			explode = game.add.sprite(player.body.x, player.body.y, 'explode');
			explode.anchor.set(0.5);
			var explosion = explode.animations.add('boom');
			explode.animations.play('boom', 30, false);
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.S)) {
		}
		timer++;
		if(game.input.x < 26)
        {
            player.x = 26;
        }
        else if(game.input.x >= 26 && game.input.x <= 774)
        {
            player.x = game.input.x;
        }
        else if(game.input.x > 774)
        {
            player.x = 774;
        }
        if (game.input.y < 26) {
            player.y = 26;
        }
        else if (game.input.y >= 26 && game.input.y <= 574) {
            player.y = game.input.y;
        }
        else if (game.input.y > 574) {
            player.y = 574;
        }
        
		if(timer == 3) {
			var block = blocks.create(game.rnd.between(8, 792), -35, 'block');
			block.anchor.set(0.5);
			block.body.velocity.y = 500;
			timer = 0;
		}
		blocks.forEach(function(eachBlock) {

			if (eachBlock.y > 650) {
				eachBlock.destroy();
			}
		}, this);
	}
}