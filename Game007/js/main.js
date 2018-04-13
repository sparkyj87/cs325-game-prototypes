
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
		game.load.image('firebutton', 'assets/sprites/firebutton.png');
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
	var firebutton1;
	var firebutton2;
	var state;
	var noHexesSelected;
	var noPiecesSelected;
	var noCopyOnBoard;
	var style;
	var text;
	var text2;
	var mousePressed;
	var boardpieces;
	var boardpieces1;
	var boardpieces2;
	var dist;
	var fxp1move;
	var fxp2move;
	var fxpiecedrop;
	var lineArray;
	var p1Hit;
	var p2Hit;
	var propCount;
	var shooterID;

	function create() {

		lineArray = [];

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
				font : "40px Arial",
				fill : "#ffffff",
				align : "center"
		};
		text = game.add.text(400, 50,"", style);
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		text2 = game.add.text(400, 550,"", style);
		text2.anchor.x = 0.5;
		text2.anchor.y = 0.5;
		mousePressed = false;
		boardpieces = game.add.group();
		var q = boardpieces.create(2000, 2000, 'boardpieces', 0);
		q.anchor.set(0.5);
		q.inputEnabled = true;
		q.input.pixelPerfectOver = true;
		q.input.priorityID = 1;
		boardpieces1 = game.add.group();
		boardpieces2 = game.add.group();
		for (var k = 0; k < 5; k++) {
			var random = game.rnd.between(1,47);
			if(random >= 1 && random <= 7)
				random = 0;
			if(random >= 8 && random <= 14)
				random = 1;
			if(random >= 15 && random <= 21)
				random = 2;
			if(random >= 22 && random <= 28)
				random = 3;
			if(random >= 29 && random <= 32)
				random = 4;
			if(random >= 33 && random <= 36)
				random = 5;
			if(random >= 37 && random <= 40)
				random = 6;
			if(random >= 41 && random <= 47)
				random = 8;
			var p = boardpieces1.create(50+30*k, 400, 'boardpieces', random);
			p.anchor.set(0.5);
			p.inputEnabled = true;
			p.input.pixelPerfectOver = true;
			p.input.priorityID = 1;
		}
		for (var k = 0; k < 5; k++) {
			var random = game.rnd.between(1,40);
			if(random >= 1 && random <= 7)
				random = 0;
			if(random >= 8 && random <= 14)
				random = 1;
			if(random >= 15 && random <= 21)
				random = 2;
			if(random >= 22 && random <= 28)
				random = 3;
			if(random >= 29 && random <= 32)
				random = 4;
			if(random >= 33 && random <= 36)
				random = 5;
			if(random >= 37 && random <= 40)
				random = 6;
			var p = boardpieces2.create(600+30*k, 150, 'boardpieces', random);
			p.anchor.set(0.5);
			p.inputEnabled = true;
			p.input.pixelPerfectOver = true;
			p.input.priorityID = 1;
		}
		hexselect.bringToTop();
		piececopy = game.add.sprite(1000, 1000, 'hexselect');
		piececopy.anchor.set(0.5);
		piececopy.alpha = 0.5;

		firebutton1 = game.add.sprite(900, 900, 'firebutton');
		firebutton1.inputEnabled = true;
		firebutton1.events.onInputDown.add(firebutton1Exec, this);

		firebutton2 = game.add.sprite(900, 900, 'firebutton');
		firebutton2.inputEnabled = true;
		firebutton2.events.onInputDown.add(firebutton2Exec, this);

		p1Hit = false;
		p2Hit = false;
		shooterID = 0;

	}
	function update() {
		noHexesSelected = true;
		noPiecesSelected = true;
		noCopyOnBoard = true;

		if(p1.x == p2.x && p1.y == p2.y)
			state = 99;
		if(state == 99) {
			if(shooterID == 1 && p2Hit){
				text.text = "Hit! Player 1 wins!";
			}
			if(shooterID == 1 && !p2Hit){
				text.text = "Miss! Player 2 wins!";
			}
			if(shooterID == 2 && p1Hit){
				text.text = "Hit! Player 2 wins!";
			}
			if(shooterID == 2 && !p1Hit){
				text.text = "Miss! Player 1 wins!";
			}
			if(shooterID == 0){
				p2.destroy();
				text.text = "Steamrolled! Player 1 wins!";
			}
			text2.text = "Press Enter to restart.";
			if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
				game.state.restart();
			}
			
		}
		if(state == 1) { // p1 move
			firebutton1.x = 105;
			firebutton1.y = 322;
			p1ind.x = 20;
			p1ind.y = 335;
			p2ind.x = 1000;
			p2ind.y = 1000;
			hexes.forEach(function(eachHex) {
				if (eachHex.input.pointerOver() && (eachHex.x != p1.x || eachHex.y != p1.y)) {
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
		if(state == 2){ // p1 aim
			firebutton1.x = 900;
			firebutton1.y = 900;
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

		if(state == 3) { // p1 piece select
			p1ind.x = 20;
			p1ind.y = 400;
			boardpieces1.forEach(function(eachBP) {
				if (eachBP.input.pointerOver()) {
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
				boardpieces1.forEach(function(eachBP) {
					if (eachBP.x == hexselect.x && eachBP.y == hexselect.y) {
						piececopy = game.add.sprite(eachBP.x, eachBP.y, 'boardpieces', eachBP.frame);
						piececopy.anchor.set(0.5);
						piececopy.alpha = 0.5;
						eachBP.destroy();
					}
				}, this);

				var random = game.rnd.between(1,47);
				if(random >= 1 && random <= 7)
					random = 0;
				if(random >= 8 && random <= 14)
					random = 1;
				if(random >= 15 && random <= 21)
					random = 2;
				if(random >= 22 && random <= 28)
					random = 3;
				if(random >= 29 && random <= 32)
					random = 4;
				if(random >= 33 && random <= 36)
					random = 5;
				if(random >= 37 && random <= 40)
					random = 6;
				if(random >= 41 && random <= 47)
					random = 8;
				var p = boardpieces1.create(hexselect.x, hexselect.y, 'boardpieces', random);
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
		if(state == 4){ // p1 piece placement
			p1ind.x = 20;
			p1ind.y = 400;
			hexes.forEach(function(eachHex) {
				if (eachHex.input.pointerOver() && !(eachHex.x == p1.x && eachHex.y == p1.y) && !(eachHex.x == p2.x && eachHex.y == p2.y)) {
					piececopy.x = eachHex.x;
					piececopy.y = eachHex.y;
					noCopyOnBoard = false;

				}
			}, this);
			boardpieces.forEach(function(eachBP) {
				if (((piececopy.frame == 8 && eachBP.frame == 8)|| piececopy.frame != 8) && eachBP.x == piececopy.x && eachBP.y == piececopy.y) {
					noCopyOnBoard = true;
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
				boardpieces.forEach(function(eachBP) {
					if (piececopy.frame == 8 && eachBP.frame != 8 && eachBP.x == piececopy.x && eachBP.y == piececopy.y) {
						eachBP.destroy();
					}
				}, this);
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

		if(state == 5) { // p1 steps on ice block
			firebutton1.x = 900;
			firebutton1.y = 900;
			p1ind.x = 20;
			p1ind.y = 335;
			hexes.forEach(function(eachHex) {
				if (eachHex.input.pointerOver() && (eachHex.x != p1.x || eachHex.y != p1.y)) {
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

		if(state == 11) { // p2 move
			firebutton2.x = 590;
			firebutton2.y = 73;
			p2ind.x = 747;
			p2ind.y = 88;
			p1ind.x = 1000;
			p1ind.y = 1000;
			hexes.forEach(function(eachHex) {
				if (eachHex.input.pointerOver() && (eachHex.x != p2.x || eachHex.y != p2.y)) {
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
			}
		}

		if(state == 22){ // p2 aim
			firebutton2.x = 900;
			firebutton2.y = 900;
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
		if(state == 23) { // p2 piece select
			p2ind.x = 747;
			p2ind.y = 150;
			boardpieces2.forEach(function(eachBP) {
				if (eachBP.input.pointerOver()) {
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
				boardpieces2.forEach(function(eachBP) {
					if (eachBP.x == hexselect.x && eachBP.y == hexselect.y) {
						piececopy.destroy();
						piececopy = game.add.sprite(1000, 1000, 'boardpieces', eachBP.frame);
						piececopy.anchor.set(0.5);
						piececopy.alpha = 0.5;
						eachBP.destroy();
					}
				}, this);

				var random = game.rnd.between(1,40);
				if(random >= 1 && random <= 7)
					random = 0;
				if(random >= 8 && random <= 14)
					random = 1;
				if(random >= 15 && random <= 21)
					random = 2;
				if(random >= 22 && random <= 28)
					random = 3;
				if(random >= 29 && random <= 32)
					random = 4;
				if(random >= 33 && random <= 36)
					random = 5;
				if(random >= 37 && random <= 40)
					random = 6;
				var p = boardpieces2.create(hexselect.x, hexselect.y, 'boardpieces', random);
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

		if(state == 24){ // p2 piece placement
			p2ind.x = 747;
			p2ind.y = 150;
			if(noCopyOnBoard){
				piececopy.x = 1000;
				piececopy.y = 1000;
			}
			hexes.forEach(function(eachHex) {
				if (eachHex.input.pointerOver() && !(eachHex.x == p1.x && eachHex.y == p1.y) && !(eachHex.x == p2.x && eachHex.y == p2.y)) {
					piececopy.x = eachHex.x;
					piececopy.y = eachHex.y;
					noCopyOnBoard = false;
				}
			}, this);

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
	}
	function firebutton1Exec() {
		state = 99;
		shooterID = 1;
		propCount = 0;
		propagate(p1.angle, p1.x, p1.y);
	}
	function firebutton2Exec() {
		state = 99;
		shooterID = 2;
		propCount = 0;
		propagate(p2.angle, p2.x, p2.y);
	}

	function propagate(dir, coorX, coorY){

		var angle = calcDir(dir);
		var onPiece = false;
		var pieceFrame;
		var pieceDir;
		boardpieces.forEach(function(eachBP) {
			if (eachBP.x == coorX && eachBP.y == coorY && eachBP.frame != 8) {
				onPiece = true;
				pieceFrame = eachBP.frame;
				pieceDir = calcDir(eachBP.angle);
			}
		}, this);

		if(onPiece && propCount != 0) {
			if(pieceFrame == 0){
				if(calcDir(pieceDir - angle) == 60) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 60), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 120) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 120), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 180) {
					propDirection(calcDir(pieceDir + 60), coorX, coorY);
					propDirection(calcDir(pieceDir + 120), coorX, coorY);
				}
			}
			if(pieceFrame == 1){
				if(calcDir(pieceDir - angle) == 0) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 120), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 60) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 180), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 180) {
					propDirection(calcDir(pieceDir + 120), coorX, coorY);
					propDirection(calcDir(pieceDir + 180), coorX, coorY);
				}
			}
			if(pieceFrame == 2){
				if(calcDir(pieceDir - angle) == 0) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 60), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 120) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 180), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 180) {
					propDirection(calcDir(pieceDir + 60), coorX, coorY);
					propDirection(calcDir(pieceDir + 180), coorX, coorY);
				}
			}
			if(pieceFrame == 3){
				if(calcDir(pieceDir - angle) == 60) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 240), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 180) {
					propDirection(calcDir(pieceDir - 120), coorX, coorY);
					propDirection(calcDir(pieceDir + 120), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 300) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 120), coorX, coorY);
				}
			}
			if(pieceFrame == 4){
				if(calcDir(pieceDir - angle) == 0) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 120), coorX, coorY);
					propDirection(calcDir(pieceDir + 240), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 60) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 180), coorX, coorY);
					propDirection(calcDir(pieceDir + 240), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 180) {
					propDirection(calcDir(pieceDir + 120), coorX, coorY);
					propDirection(calcDir(pieceDir + 180), coorX, coorY);
					propDirection(calcDir(pieceDir + 240), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 300) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 120), coorX, coorY);
					propDirection(calcDir(pieceDir + 180), coorX, coorY);
				}
			}
			if(pieceFrame == 5){
				if(calcDir(pieceDir - angle) == 0) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 60), coorX, coorY);
					propDirection(calcDir(pieceDir + 240), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 120) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 180), coorX, coorY);
					propDirection(calcDir(pieceDir + 240), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 180) {
					propDirection(calcDir(pieceDir + 60), coorX, coorY);
					propDirection(calcDir(pieceDir + 180), coorX, coorY);
					propDirection(calcDir(pieceDir + 240), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 300) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 60), coorX, coorY);
					propDirection(calcDir(pieceDir + 180), coorX, coorY);
				}
			}
			if(pieceFrame == 6){
				if(calcDir(pieceDir - angle) == 0) {
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 60), coorX, coorY);
					propDirection(calcDir(pieceDir + 120), coorX, coorY);
					propDirection(calcDir(pieceDir + 240), coorX, coorY);
					propDirection(calcDir(pieceDir + 300), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 60) {
					propDirection(calcDir(pieceDir - 60), coorX, coorY);
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 60), coorX, coorY);
					propDirection(calcDir(pieceDir + 180), coorX, coorY);
					propDirection(calcDir(pieceDir + 240), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 120) {
					propDirection(calcDir(pieceDir - 120), coorX, coorY);
					propDirection(calcDir(pieceDir - 60), coorX, coorY);
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 120), coorX, coorY);
					propDirection(calcDir(pieceDir + 180), coorX, coorY);

				}
				if(calcDir(pieceDir - angle) == 180) {
					propDirection(calcDir(pieceDir - 180), coorX, coorY);
					propDirection(calcDir(pieceDir - 120), coorX, coorY);
					propDirection(calcDir(pieceDir - 60), coorX, coorY);
					propDirection(calcDir(pieceDir + 60), coorX, coorY);
					propDirection(calcDir(pieceDir + 120), coorX, coorY);

				}
				if(calcDir(pieceDir - angle) == 240) {
					propDirection(calcDir(pieceDir - 240), coorX, coorY);
					propDirection(calcDir(pieceDir - 180), coorX, coorY);
					propDirection(calcDir(pieceDir - 120), coorX, coorY);
					propDirection(calcDir(pieceDir), coorX, coorY);
					propDirection(calcDir(pieceDir + 60), coorX, coorY);
				}
				if(calcDir(pieceDir - angle) == 300) {
					propDirection(calcDir(pieceDir - 300), coorX, coorY);
					propDirection(calcDir(pieceDir - 240), coorX, coorY);
					propDirection(calcDir(pieceDir - 180), coorX, coorY);
					propDirection(calcDir(pieceDir - 60), coorX, coorY);
					propDirection(calcDir(pieceDir), coorX, coorY);
				}
			}
		}
		else {
			propDirection(angle, coorX, coorY);
		}

	}

	function propDirection(angle, coorX, coorY) {
		propCount++;
		var strKey = "" + (angle+360) + "" + coorX + "" + coorY;
		var arrayContains = lineArray.includes(strKey);
		if(!arrayContains){
			lineArray.push(strKey);
			if(propCount < 1000){
				if(angle == 0 && (coorX + 30 <= 480 + ((coorY - 125) / 25) * 15)){
					if(checkDirPath(angle, coorX + 30, coorY)) {
						var line = game.add.graphics(coorX, coorY);
						line.lineStyle(2, 0x00FF00, 1);
						line.lineTo(30, 0);
						propagate(angle, coorX + 30, coorY);
					}
				}
				if(angle == 60 && (coorY < 425)){
					if(checkDirPath(angle, coorX + 15, coorY + 25)) {
						var line = game.add.graphics(coorX, coorY);
						line.lineStyle(2, 0x00FF00, 1);
						line.lineTo(15, 25);
						propagate(angle, coorX + 15, coorY + 25);
					}
				}
				if(angle == 120 && (coorY < 425) && (coorX - 15 > 120 + ((coorY - 125) / 25) * 15)){
					if(checkDirPath(angle, coorX - 15, coorY + 25)) {
						var line = game.add.graphics(coorX, coorY);
						line.lineStyle(2, 0x00FF00, 1);
						line.lineTo(-15, 25);
						propagate(angle, coorX - 15, coorY + 25);
					}
				}
				if(angle == 180 && (coorX > 120 + ((coorY - 125) / 25) * 15)){
					if(checkDirPath(angle, coorX - 30, coorY)) {
						var line = game.add.graphics(coorX, coorY);
						line.lineStyle(2, 0x00FF00, 1);
						line.lineTo(-30, 0);
						propagate(angle, coorX - 30, coorY);
					}
				}
				if(angle == 240 && (coorY > 125)){
					if(checkDirPath(angle, coorX - 15, coorY - 25)) {
						var line = game.add.graphics(coorX, coorY);
						line.lineStyle(2, 0x00FF00, 1);
						line.lineTo(-15, -25);
						propagate(angle, coorX - 15, coorY - 25);
					}
				}
				if(angle == 300 && (coorY > 125) && (coorX + 15 < 480 + ((coorY - 125) / 25) * 15)){
					if(checkDirPath(angle, coorX + 15, coorY - 25)) {
						var line = game.add.graphics(coorX, coorY);
						line.lineStyle(2, 0x00FF00, 1);
						line.lineTo(15, -25);
						propagate(angle, coorX + 15, coorY - 25);
					}
				}
			}
		}
	}

	function checkDirPath(dir, coordX, coordY){
		var passMargin = true;
		var passPieceDir = true;


		if(coordX == p1.x && coordY == p1.y)
			p1Hit = true;
		if(coordX == p2.x && coordY == p2.y)
			p2Hit = true;
		if((coordX < 120 + ((coordY - 125) / 25) * 15) || (coordX > 480 + ((coordY - 125) / 25) * 15) || (coordY < 125) || (coordY > 425)) {
			passMargin = false;
		}

		boardpieces.forEach(function(eachBP) {
			if (eachBP.frame != 8 && eachBP.x == coordX && eachBP.y == coordY) {
				var angle = calcDir(eachBP.angle);
				if(eachBP.frame == 0 && (angle == dir || angle == (dir + 300) % 360 || angle == (dir + 240) % 360)) {
					passPieceDir = false;
				}
				if(eachBP.frame == 1 && (angle == (dir + 300) % 360 || angle == (dir + 240) % 360 || angle == (dir + 120) % 360)) {
					passPieceDir = false;
				}
				if(eachBP.frame == 2 && (angle == (dir + 60) % 360 || angle == (dir + 240) % 360 || angle == (dir + 300) % 360)) {
					passPieceDir = false;
				}
				if(eachBP.frame == 3 && (angle == dir || angle == (dir + 120) % 360 || angle == (dir + 240) % 360)) {
					passPieceDir = false;
				}
				if(eachBP.frame == 4 && (angle == (dir + 120) % 360 || angle == (dir + 240) % 360)) {
					passPieceDir = false;
				}
				if(eachBP.frame == 5 && (angle == (dir + 60) % 360 || angle == (dir + 240) % 360)) {
					passPieceDir = false;
				}
			}
		}, this);
		if(passMargin && passPieceDir) {
			return true;
		}
		return false;
	}

	function calcDir(num) {
		return (Math.round(num) + 360) % 360;
	}
}
