
"use strict";

window.onload = function() {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
		preload : preload,
		create : create,
		update : update
	});

	function preload() {

		game.load.image('hex', 'assets/sprites/hex.png');
		game.load.image('hexselect', 'assets/sprites/hexselect.png');
		game.load.image('p1', 'assets/sprites/p1.png');
		game.load.image('p2', 'assets/sprites/p2.png');
		game.load.image('background', 'assets/sprites/background.png');
		game.load.spritesheet('boardpieces','assets/sprites/boardpieces.png',29,29);
		game.load.audio('p1move', 'assets/audio/p1move.mp3');
		game.load.audio('p2move', 'assets/audio/p2move.mp3');
		game.load.audio('piecedrop', 'assets/audio/piecedrop.mp3');
	}

	var hexes;
	var hexselect;
	var piececopy;
	var p1;
	var p2;
	var p1ind;
	var p2ind;
	var state;
	var noHexesSelected;
	var noPiecesSelected;
	var noCopyOnBoard;
	var style;
	var text;
	var mousePressed;
	var boardpieces;
	var dist;
	var fxp1move;
	var fxp2move;
	var fxpiecedrop;

	function create() {

		fxp1move = game.add.audio('p1move');
		fxp2move = game.add.audio('p2move');
		fxpiecedrop = game.add.audio('piecedrop');
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.add.sprite(0, 0, 'background');
		hexes = game.add.group();
		for (var i = 1; i < 14; i++) {
			for (var j = 1; j < 14; j++) {
				var s = hexes.create(90 + 30*j + (i-1)*15, 100 + 25*i, 'hex');
				s.anchor.set(0.5);
				s.inputEnabled = true;
				s.input.pixelPerfectOver = true;
				s.input.priorityID = 2;
			}
		}
		hexselect = game.add.sprite(1000, 1000, 'hexselect');
		hexselect.anchor.set(0.5);
		hexselect.alpha = 0.5;
		p1 = game.add.sprite(120,125,'p1');
		p1.anchor.set(0.5);
		game.physics.enable(p1, Phaser.Physics.ARCADE);
		p2 = game.add.sprite(660,425,'p2');
		p2.angle = 180;
		p2.anchor.set(0.5);
		game.physics.enable(p2, Phaser.Physics.ARCADE);
		p1ind = game.add.sprite(20,335,'p1');
		p1ind.anchor.set(0.5);
		p2ind = game.add.sprite(1000,1000,'p2');
		p2ind.angle = 180;
		p2ind.anchor.set(0.5);
		state = 1;
		noHexesSelected = true;
		style = {
				font : "30px Arial",
				fill : "#ff0000",
				align : "center"
		};
		text = game.add.text(1000, 1000,"Hi", style);
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		mousePressed = false;
		boardpieces = game.add.group();
		for (var k = 0; k < 5; k++) {
			var random = game.rnd.between(1,25);
			if(random >= 1 && random <= 5)
				random = 0;
			if(random == 6)
				random = 1;
			if(random == 7)
				random = 2;
			if(random >= 8 && random <= 12)
				random = 3;
			if(random >= 13 && random <= 17)
				random = 4;
			if(random >= 18 && random <= 20)
				random = 5;
			if(random >= 21 && random <= 22)
				random = 6;
			if(random >= 23 && random <= 25)
				random = 8;
			var p = boardpieces.create(50+30*k, 400, 'boardpieces', random);
			p.anchor.set(0.5);
			p.inputEnabled = true;
			p.input.pixelPerfectOver = true;
			p.input.priorityID = 1;
		}
		for (var k = 0; k < 5; k++) {
			var random = game.rnd.between(1,25);
			if(random >= 1 && random <= 5)
				random = 0;
			if(random == 6)
				random = 1;
			if(random == 7)
				random = 2;
			if(random >= 8 && random <= 12)
				random = 3;
			if(random >= 13 && random <= 17)
				random = 4;
			if(random >= 18 && random <= 20)
				random = 5;
			if(random >= 21 && random <= 22)
				random = 6;
			if(random >= 23 && random <= 25)
				random = 7;
			var p = boardpieces.create(600+30*k, 150, 'boardpieces', random);
			p.anchor.set(0.5);
			p.inputEnabled = true;
			p.input.pixelPerfectOver = true;
			p.input.priorityID = 1;
		}
		hexselect.bringToTop();
		piececopy = game.add.sprite(1000, 1000, 'hexselect');
		piececopy.anchor.set(0.5);
		piececopy.alpha = 0.5;
	}
	function update() {
		noHexesSelected = true;
		noPiecesSelected = true;
		noCopyOnBoard = true;

		if(p1.x == p2.x && p1.y == p2.y)
			game.state.restart();
		if(state == 1) { //p1 move
			p1ind.x = 20;
			p1ind.y = 335;
			p2ind.x = 1000;
			p2ind.y = 1000;
			hexes.forEach(function(eachHex) {
				if (eachHex.input.pointerOver() && (eachHex.x != p1.x || eachHex.y != p1.y)) {
					text.text = "" + (Math.pow(eachHex.x - p1.x,2) + Math.pow(eachHex.y - p1.y,2));
					if ((Math.pow(eachHex.x - p1.x,2) + Math.pow(eachHex.y - p1.y,2)) < Math.pow(31,2)){
						hexselect.x = eachHex.x;
						hexselect.y = eachHex.y;
						noHexesSelected = false;
					}
				}
			}, this);
			if(noHexesSelected){
				hexselect.x = 1000;
				hexselect.y = 1000;
			}
			if(game.input.activePointer.leftButton.isDown && hexselect.x != 1000 && hexselect.y != 1000) {
				mousePressed = true;
			}
			if(mousePressed && game.input.activePointer.leftButton.isUp && hexselect.x != 1000 && hexselect.y != 1000){
				fxp1move.play();
				p1.x = hexselect.x;
				p1.y = hexselect.y;
				p1.bringToTop();
				hexselect.x = 1000;
				hexselect.y = 1000;
				state = 2;
				mousePressed = false;
				boardpieces.forEach(function(eachBP) {
					if(eachBP.x == p1.x && eachBP.y == p1.y && eachBP.frame == 8)
						state = 5;
				}, this);
			}
		}
		if(state == 2){ //p1 aim
			p1ind.x = 20;
			p1ind.y = 365;
			hexes.forEach(function(eachHex) {
				if((game.input.mousePointer.x - p1.x>0) && Math.abs((game.input.mousePointer.x - p1.x)/(game.input.mousePointer.y - p1.y))>25/15)
					p1.angle = 0;
				if((game.input.mousePointer.x - p1.x<0) && Math.abs((game.input.mousePointer.x - p1.x)/(game.input.mousePointer.y - p1.y))>25/15)
					p1.angle = 180;
				if((game.input.mousePointer.x - p1.x>0) && (game.input.mousePointer.y - p1.y<0) && Math.abs((game.input.mousePointer.x - p1.x)/(game.input.mousePointer.y - p1.y))<25/15)
					p1.angle = 300;
				if((game.input.mousePointer.x - p1.x<0) && (game.input.mousePointer.y - p1.y<0) && Math.abs((game.input.mousePointer.x - p1.x)/(game.input.mousePointer.y - p1.y))<25/15)
					p1.angle = 240;
				if((game.input.mousePointer.x - p1.x>0) && (game.input.mousePointer.y - p1.y>0) && Math.abs((game.input.mousePointer.x - p1.x)/(game.input.mousePointer.y - p1.y))<25/15)
					p1.angle = 60;
				if((game.input.mousePointer.x - p1.x<0) && (game.input.mousePointer.y - p1.y>0) && Math.abs((game.input.mousePointer.x - p1.x)/(game.input.mousePointer.y - p1.y))<25/15)
					p1.angle = 120;
			}, this);
			if(game.input.activePointer.leftButton.isDown) {
				mousePressed = true;
			}
			if(mousePressed && game.input.activePointer.leftButton.isUp){
				fxp1move.play();
				state = 3;
				mousePressed = false;
			}
		}

		if(state == 3) { //p1 piece select
			p1ind.x = 20;
			p1ind.y = 400;
			boardpieces.forEach(function(eachBP) {
				if(eachBP.x == 1000 && eachBP.y == 1000)
					text.text = "theres a remainder!";
				if (eachBP.input.pointerOver() && game.input.mousePointer.y > 300) {
					hexselect.x = eachBP.x;
					hexselect.y = eachBP.y;
					noPiecesSelected = false;
				}
			}, this);
			if(noPiecesSelected){
				hexselect.x = 1000;
				hexselect.y = 1000;
			}
			if(game.input.activePointer.leftButton.isDown && hexselect.x != 1000 && hexselect.y != 1000) {
				mousePressed = true;
			}
			if(mousePressed && game.input.activePointer.leftButton.isUp && hexselect.x != 1000 && hexselect.y != 1000){
				fxpiecedrop.play();
				text.text = "copied!";
				boardpieces.forEach(function(eachBP) {
					if (eachBP.x == hexselect.x && eachBP.y == hexselect.y) {
						piececopy = eachBP;
						piececopy.alpha = 0.5;
					}
				}, this);

				var random = game.rnd.between(1,25);
				if(random >= 1 && random <= 5)
					random = 0;
				if(random == 6)
					random = 1;
				if(random == 7)
					random = 2;
				if(random >= 8 && random <= 12)
					random = 3;
				if(random >= 13 && random <= 17)
					random = 4;
				if(random >= 18 && random <= 20)
					random = 5;
				if(random >= 21 && random <= 22)
					random = 6;
				if(random >= 23 && random <= 25)
					random = 8;
				var p = boardpieces.create(hexselect.x, hexselect.y, 'boardpieces', random);
				p.anchor.set(0.5);
				p.inputEnabled = true;
				p.input.pixelPerfectOver = true;
				p.input.priorityID = 1;
				hexselect.x = 1000;
				hexselect.y = 1000;
				state = 4;
				mousePressed = false;
			}
		}
		if(state == 4){ //p1 piece placement
			p1ind.x = 20;
			p1ind.y = 400;
			var curX = 1000;
			var curY = 1000;
			hexes.forEach(function(eachHex) {
				if (eachHex.input.pointerOver() && !(eachHex.x == p1.x && eachHex.y == p1.y) && !(eachHex.x == p2.x && eachHex.y == p2.y)) {
					text.text = "" + (Math.pow(eachHex.x - p1.x,2) + Math.pow(eachHex.y - p1.y,2));
					
					curX = eachHex.x;
					curY = eachHex.y;
				}
			}, this);
			boardpieces.forEach(function(eachBP) {
				if (eachBP.x != curX || eachBP.y != curY) {
					piececopy.x = curX;
					piececopy.y = curY;
					noCopyOnBoard = false;
				}
			}, this);
			if(noCopyOnBoard){
				piececopy.x = 1000;
				piececopy.y = 1000;
			}
			if((game.input.mousePointer.x - piececopy.x>0) && Math.abs((game.input.mousePointer.x - piececopy.x)/(game.input.mousePointer.y - piececopy.y))>25/15)
				piececopy.angle = 0;
			if((game.input.mousePointer.x - piececopy.x<0) && Math.abs((game.input.mousePointer.x - piececopy.x)/(game.input.mousePointer.y - piececopy.y))>25/15)
				piececopy.angle = 180;
			if((game.input.mousePointer.x - piececopy.x>0) && (game.input.mousePointer.y - piececopy.y<0) && Math.abs((game.input.mousePointer.x - piececopy.x)/(game.input.mousePointer.y - piececopy.y))<25/15)
				piececopy.angle = 300;
			if((game.input.mousePointer.x - piececopy.x<0) && (game.input.mousePointer.y - piececopy.y<0) && Math.abs((game.input.mousePointer.x - piececopy.x)/(game.input.mousePointer.y - piececopy.y))<25/15)
				piececopy.angle = 240;
			if((game.input.mousePointer.x - piececopy.x>0) && (game.input.mousePointer.y - piececopy.y>0) && Math.abs((game.input.mousePointer.x - piececopy.x)/(game.input.mousePointer.y - piececopy.y))<25/15)
				piececopy.angle = 60;
			if((game.input.mousePointer.x - piececopy.x<0) && (game.input.mousePointer.y - piececopy.y>0) && Math.abs((game.input.mousePointer.x - piececopy.x)/(game.input.mousePointer.y - piececopy.y))<25/15)
				piececopy.angle = 120;
			if(game.input.activePointer.leftButton.isDown && piececopy.x != 1000 & piececopy.y != 1000) {
				mousePressed = true;
			}
			if(piececopy.x == 1000 & piececopy.y == 1000)
				mousePressed = false;
			if(mousePressed && game.input.activePointer.leftButton.isUp && piececopy.x != 1000 & piececopy.y != 1000){
				fxpiecedrop.play();
				var p = boardpieces.create(piececopy.x, piececopy.y, 'boardpieces', piececopy.frame);
				p.anchor.set(0.5);
				p.inputEnabled = true;
				p.input.pixelPerfectOver = true;
				p.input.priorityID = 1;
				p.angle = piececopy.angle;
				piececopy.destroy();
				state = 11;
				mousePressed = false;
			}

		}

		if(state == 5) { //p1 steps on ice block
			p1ind.x = 20;
			p1ind.y = 335;
			hexes.forEach(function(eachHex) {
				if (eachHex.input.pointerOver() && (eachHex.x != p1.x || eachHex.y != p1.y)) {
					text.text = "" + (Math.pow(eachHex.x - p1.x,2) + Math.pow(eachHex.y - p1.y,2));
					if (eachHex.y == p1.y || (eachHex.x - p1.x)/(eachHex.y - p1.y) == 15/25 || (eachHex.x - p1.x)/(eachHex.y - p1.y) == -15/25){
						hexselect.x = eachHex.x;
						hexselect.y = eachHex.y;
						noHexesSelected = false;
					}
				}
			}, this);
			if(noHexesSelected){
				hexselect.x = 1000;
				hexselect.y = 1000;
			}
			if(game.input.activePointer.leftButton.isDown && hexselect.x != 1000 && hexselect.y != 1000) {
				mousePressed = true;
			}
			if(mousePressed && game.input.activePointer.leftButton.isUp && hexselect.x != 1000 && hexselect.y != 1000){
				fxp1move.play();
				p1.x = hexselect.x;
				p1.y = hexselect.y;
				p1.bringToTop();
				hexselect.x = 1000;
				hexselect.y = 1000;
				state = 2;
				boardpieces.forEach(function(eachBP) {
					if(eachBP.x == p1.x && eachBP.y == p1.y)
						state = 5;
				}, this);
				mousePressed = false;
			}
		}

		if(state == 11) { //p2 move
			p2ind.x = 747;
			p2ind.y = 88;
			p1ind.x = 1000;
			p1ind.y = 1000;
			hexes.forEach(function(eachHex) {
				if (eachHex.input.pointerOver() && (eachHex.x != p2.x || eachHex.y != p2.y)) {
					text.text = "" + (Math.pow(eachHex.x - p2.x,2) + Math.pow(eachHex.y - p2.y,2));
					if ((Math.pow(eachHex.x - p2.x,2) + Math.pow(eachHex.y - p2.y,2)) < 14500){
						hexselect.x = eachHex.x;
						hexselect.y = eachHex.y;
						noHexesSelected = false;
					}
				}
			}, this);
			if(noHexesSelected){
				hexselect.x = 1000;
				hexselect.y = 1000;
			}
			if(game.input.activePointer.leftButton.isDown && hexselect.x != 1000 && hexselect.y != 1000) {
				mousePressed = true;
			}
			if(mousePressed && game.input.activePointer.leftButton.isUp && hexselect.x != 1000 && hexselect.y != 1000){
				fxp2move.play();
				dist = (Math.pow(hexselect.x - p2.x,2) + Math.pow(hexselect.y - p2.y,2))
				p2.x = hexselect.x;
				p2.y = hexselect.y;
				p2.bringToTop();
				hexselect.x = 1000;
				hexselect.y = 1000;
				state = 22;
				mousePressed = false;
				var portalCount = 0;
				boardpieces.forEach(function(eachBP) {
					if(eachBP.frame == 7 && !(eachBP.x > 580 && eachBP.x < 770 && eachBP.y > 140 && eachBP.y < 170))
						portalCount++;
				}, this);
				boardpieces.forEach(function(eachBP) {
					if(eachBP.x == p2.x && eachBP.y == p2.y && eachBP.frame == 7 && portalCount > 1)
					{
						state = 25;
						text.text = "state 25!";
					}


				}, this);
			}
		}

		if(state == 22){ //p2 aim
			p2ind.x = 747;
			p2ind.y = 118;
			hexes.forEach(function(eachHex) {
				if((game.input.mousePointer.x - p2.x>0) && Math.abs((game.input.mousePointer.x - p2.x)/(game.input.mousePointer.y - p2.y))>25/15)
					p2.angle = 0;
				if((game.input.mousePointer.x - p2.x<0) && Math.abs((game.input.mousePointer.x - p2.x)/(game.input.mousePointer.y - p2.y))>25/15)
					p2.angle = 180;
				if((game.input.mousePointer.x - p2.x>0) && (game.input.mousePointer.y - p2.y<0) && Math.abs((game.input.mousePointer.x - p2.x)/(game.input.mousePointer.y - p2.y))<25/15)
					p2.angle = 300;
				if((game.input.mousePointer.x - p2.x<0) && (game.input.mousePointer.y - p2.y<0) && Math.abs((game.input.mousePointer.x - p2.x)/(game.input.mousePointer.y - p2.y))<25/15)
					p2.angle = 240;
				if((game.input.mousePointer.x - p2.x>0) && (game.input.mousePointer.y - p2.y>0) && Math.abs((game.input.mousePointer.x - p2.x)/(game.input.mousePointer.y - p2.y))<25/15)
					p2.angle = 60;
				if((game.input.mousePointer.x - p2.x<0) && (game.input.mousePointer.y - p2.y>0) && Math.abs((game.input.mousePointer.x - p2.x)/(game.input.mousePointer.y - p2.y))<25/15)
					p2.angle = 120;
			}, this);
			if(game.input.activePointer.leftButton.isDown) {
				mousePressed = true;
			}
			if(mousePressed && game.input.activePointer.leftButton.isUp){
				fxp2move.play();
				state = 23;
				mousePressed = false;
				noPiecesSelected = true;
			}
		}
		if(state == 23) { //p2 piece select
			p2ind.x = 747;
			p2ind.y = 150;
			boardpieces.forEach(function(eachBP) {
				if (eachBP.input.pointerOver() && eachBP.x > 580 && eachBP.y < 180) {
					hexselect.x = eachBP.x;
					hexselect.y = eachBP.y;
					noPiecesSelected = false;
				}
			}, this);
			if(noPiecesSelected){
				hexselect.x = 1000;
				hexselect.y = 1000;
			}
			if(game.input.activePointer.leftButton.isDown && hexselect.x != 1000 && hexselect.y != 1000) {
				mousePressed = true;
			}
			if(mousePressed && game.input.activePointer.leftButton.isUp && hexselect.x != 1000 && hexselect.y != 1000){
				fxpiecedrop.play();
				text.text = "copied!";
				boardpieces.forEach(function(eachBP) {
					if (eachBP.x == hexselect.x && eachBP.y == hexselect.y) {
						piececopy = eachBP;
						piececopy.alpha = 0.5;
					}
				}, this);

				var random = game.rnd.between(1,25);
				if(random >= 1 && random <= 5)
					random = 0;
				if(random == 6)
					random = 1;
				if(random == 7)
					random = 2;
				if(random >= 8 && random <= 12)
					random = 3;
				if(random >= 13 && random <= 17)
					random = 4;
				if(random >= 18 && random <= 20)
					random = 5;
				if(random >= 21 && random <= 22)
					random = 6;
				if(random >= 23 && random <= 25)
					random = 7;
				var p = boardpieces.create(hexselect.x, hexselect.y, 'boardpieces', random);
				p.anchor.set(0.5);
				p.inputEnabled = true;
				p.input.pixelPerfectOver = true;
				p.input.priorityID = 1;
				hexselect.x = 1000;
				hexselect.y = 1000;
				state = 24;
				mousePressed = false;
				noCopyOnBoard = true;
			}
		}
		if(state == 24){ //p2 piece placement
			p2ind.x = 747;
			p2ind.y = 150;
			hexes.forEach(function(eachHex) {
				if (eachHex.input.pointerOver() && !(eachHex.x == p1.x && eachHex.y == p1.y) && !(eachHex.x == p2.x && eachHex.y == p2.y)) {
					text.text = "" + piececopy.x + "," + piececopy.y;
					piececopy.x = eachHex.x;
					piececopy.y = eachHex.y;
					noCopyOnBoard = false;
				}
			}, this);
			if(noCopyOnBoard){
				piececopy.x = 1000;
				piececopy.y = 1000;
			}
			if((game.input.mousePointer.x - piececopy.x>0) && Math.abs((game.input.mousePointer.x - piececopy.x)/(game.input.mousePointer.y - piececopy.y))>25/15)
				piececopy.angle = 0;
			if((game.input.mousePointer.x - piececopy.x<0) && Math.abs((game.input.mousePointer.x - piececopy.x)/(game.input.mousePointer.y - piececopy.y))>25/15)
				piececopy.angle = 180;
			if((game.input.mousePointer.x - piececopy.x>0) && (game.input.mousePointer.y - piececopy.y<0) && Math.abs((game.input.mousePointer.x - piececopy.x)/(game.input.mousePointer.y - piececopy.y))<25/15)
				piececopy.angle = 300;
			if((game.input.mousePointer.x - piececopy.x<0) && (game.input.mousePointer.y - piececopy.y<0) && Math.abs((game.input.mousePointer.x - piececopy.x)/(game.input.mousePointer.y - piececopy.y))<25/15)
				piececopy.angle = 240;
			if((game.input.mousePointer.x - piececopy.x>0) && (game.input.mousePointer.y - piececopy.y>0) && Math.abs((game.input.mousePointer.x - piececopy.x)/(game.input.mousePointer.y - piececopy.y))<25/15)
				piececopy.angle = 60;
			if((game.input.mousePointer.x - piececopy.x<0) && (game.input.mousePointer.y - piececopy.y>0) && Math.abs((game.input.mousePointer.x - piececopy.x)/(game.input.mousePointer.y - piececopy.y))<25/15)
				piececopy.angle = 120;
			if(game.input.activePointer.leftButton.isDown && piececopy.x != 1000 & piececopy.y != 1000) {
				mousePressed = true;
			}
			if(piececopy.x == 1000 & piececopy.y == 1000)
				mousePressed = false;
			if(mousePressed && game.input.activePointer.leftButton.isUp && piececopy.x != 1000 & piececopy.y != 1000){
				fxpiecedrop.play();
				var p = boardpieces.create(piececopy.x, piececopy.y, 'boardpieces', piececopy.frame);
				p.anchor.set(0.5);
				p.inputEnabled = true;
				p.input.pixelPerfectOver = true;
				p.input.priorityID = 1;
				p.angle = piececopy.angle;
				piececopy.destroy();
				state = 1;
				mousePressed = false;
			}
		}
		if (state == 25) { //p2 landed on portal
			p2ind.x = 747;
			p2ind.y = 88;
			p1ind.x = 1000;
			p1ind.y = 1000;
			hexselect.bringToTop();
			if(dist == 14400 || dist == 11650 || dist == 10600 || dist == 11250 || dist == 13600 || dist == 10900 || dist == 10000)
				dist = 0;
			if(dist == 8100 || dist == 6250 || dist == 6100 || dist == 7650 || dist == 5850)
				dist = 1;
			if(dist == 3600 || dist == 2650 || dist == 3400 || dist == 2500)
				dist = 2;
			if(dist == 900 || dist == 850)
				dist = 3;
			text.text = "" + game.input.mousePointer.x;
			boardpieces.forEach(function(eachBP) {
				if (eachBP.frame == 7) {
					eachBP.input.priorityID = 4;
				}
			}, this);
			boardpieces.forEach(function(eachBP) {
				if (eachBP.frame == 7 && eachBP.input.pointerOver()) {
					hexselect.x = eachBP.x;
					hexselect.y = eachBP.y;
					noHexesSelected = false;
					text.text = "" + dist;
				}
			}, this);
			if(noHexesSelected){
				hexselect.x = 1000;
				hexselect.y = 1000;
			}
			if(game.input.activePointer.leftButton.isDown && hexselect.x != 1000 && hexselect.y != 1000) {
				mousePressed = true;
			}
			if(mousePressed && game.input.activePointer.leftButton.isUp && hexselect.x != 1000 && hexselect.y != 1000){
				fxp2move.play();
				p2.x = hexselect.x;
				p2.y = hexselect.y;
				p2.bringToTop();
				hexselect.x = 1000;
				hexselect.y = 1000;
				state = 26;
				mousePressed = false;
				boardpieces.forEach(function(eachBP) {
					if (eachBP.frame == 7) {
						eachBP.input.priorityID = 1;
					}
				}, this);
			}
		}
		if(state == 26) { //p2 teleported
			p2ind.x = 747;
			p2ind.y = 88;
			p1ind.x = 1000;
			p1ind.y = 1000;
			hexes.forEach(function(eachHex) {
				if (eachHex.input.pointerOver() && (eachHex.x != p2.x || eachHex.y != p2.y)) {
					text.text = "" + (Math.pow(eachHex.x - p2.x,2) + Math.pow(eachHex.y - p2.y,2));
					if ((Math.pow(eachHex.x - p2.x,2) + Math.pow(eachHex.y - p2.y,2)) <= dist*dist*30*30){
						hexselect.x = eachHex.x;
						hexselect.y = eachHex.y;
						noHexesSelected = false;
					}
				}
			}, this);
			if(noHexesSelected){
				hexselect.x = 1000;
				hexselect.y = 1000;
			}
			if(game.input.activePointer.leftButton.isDown && hexselect.x != 1000 && hexselect.y != 1000) {
				mousePressed = true;
			}
			if(mousePressed && game.input.activePointer.leftButton.isUp && hexselect.x != 1000 && hexselect.y != 1000){
				fxp2move.play();
				dist = (Math.pow(hexselect.x - p2.x,2) + Math.pow(hexselect.y - p2.y,2))
				p2.x = hexselect.x;
				p2.y = hexselect.y;
				p2.bringToTop();
				hexselect.x = 1000;
				hexselect.y = 1000;
				state = 22;
				mousePressed = false;
			}
		}
	}
}
