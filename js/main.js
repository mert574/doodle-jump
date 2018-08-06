import Vec from "./helpers/Vec.js";
import { randInt, randColor } from "./helpers/Math.js";

import { DebugEntity, DebugPlayer, BoundaryCheck } from "./game/Traits.js";
import { Player, Wall, Solid } from "./game/Entity.js";
import Controller from "./game/Controller.js";

const canvas = document.querySelector('canvas');
const context = canvas.getContext("2d");
const deltaTime = 0.016;
const floorGap = 180;
const GRAVITY = 4000;

let gameStarted = false;
let entities = [];
let gameSpeed = 3;
let player;
let ground;
let controller;
let bgMusic,jumpSound, groundSound;
let bgImg;
let _updateSingletonCheck = 0;

init();
start();

function init() {
	player = new Player(
		new Vec(canvas.width/2-20, canvas.height-120), //pos
		new Vec(40, 40)); //size

	player.changeColor('#aa3311');

	[new BoundaryCheck(canvas)/*, new DebugPlayer(context)*/]
		.forEach(trait=>player.addTrait(trait))

	ground = new Solid(
		new Vec(0, canvas.height-80),
		new Vec(canvas.width, 80)
	);

	ground.changeColor('#CCCC00');

	entities.push(player);
	entities.push(ground);

	controller = new Controller(player);

	controller.onEvent('jump', keyState => {
		if (!keyState) return

		if (player.dead) {
			console.log('reset');
			reset();
		} else if (!gameStarted){
			bgMusic.play();
			gameStarted = true;
		}
		
		if (gameStarted && keyState){
			jumpSound.seek = 0;
			jumpSound.play();
		}
	});

	bgMusic = new Audio('sound/bg.mp3');
	jumpSound = new Audio('sound/jump.mp3');
	groundSound = new Audio('sound/hit.mp3');

	bgImg = new Image();
	bgImg.src = 'img/bg.jpg';

	jumpSound.volume = 0.25;
	groundSound.volume = 0.15;
	bgMusic.volume = 0.85;
}

function start() {
	for (let i = 0; i < 10; i++) {
		const pos = new Vec(
			randInt(4, canvas.width - 144),
			floorGap * i
		);

		const wall = new Wall(pos, randInt(50, 160));

		wall.changeColor('#CCCC00');
		entities.push(wall);
	}

	if (!_updateSingletonCheck++)
		update();

	document.getElementById('loading').remove();
}

let lastCollidingWith;

function update() {
	draw(deltaTime);

	if (gameStarted) {
		
		if (player.dead) {
			bgMusic.pause();
			context.fillStyle = '#cc2211';
			context.fillRect(0, canvas.height/2-41, canvas.width, 50);
			context.fillStyle = '#eee';
			context.font = "48px Arial"
			context.fillText(`Game Over!`, canvas.width/2-140, canvas.height/2);
			//return
		} else {
			for (const entity of entities) {
				entity.updatePositions(deltaTime);
			}

			for (let i = entities.length - 1; i >= 0; i--) {
				const entity = entities[i];

				if ((entity.type == 'solid' || entity.type == 'wall')
					&& entity.collision) {
					if (player.checkCollision(entity)) {
						player.resolveCollision(entity);

						if (player.collidingWith != lastCollidingWith) {
							lastCollidingWith = player.collidingWith;
							player.score++;
							groundSound.seek = 0.2;
							groundSound.play();
						}
					}
				}

				if (entity.type == 'wall') {
					entity.pos.y += gameSpeed;

					if (entity.pos.y >= canvas.height) {
						entities.splice(i, 1);
					}
				}

				entity.update(deltaTime);
			}

			if (entities[entities.length-1].pos.y > 100) {
				const pos = new Vec(
					randInt(4, canvas.width - 144), 
					randInt(24, 324) * -1
				);
				const wall = new Wall(pos, randInt(60, 160));

				wall.changeColor('#CCCC00');
				entities.push(wall);
			}
		}

	} else {
		context.fillStyle = '#226622';
		context.fillRect(0, canvas.height / 2 - 41, canvas.width, 50);
		context.fillStyle = '#eee';
		context.font = "48px Arial"
		context.fillText(`Press JUMP to Start`, 
			10, canvas.height / 2, canvas.width-20);
	}

	requestAnimationFrame(update);
}

function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.drawImage(bgImg, 0, 0);

	for (const entity of entities) {
		entity.draw(context);
	}

	context.font = '28px Verdana';
	context.fillStyle = 'red';
	context.fillText(`Score: ${player.score}`, 10, 30);
}

function reset() {

	entities = [];
	entities.length = 0;

	player.dead = false;
	player.score = 0;

	gameStarted = false;
	
	entities.push(player);
	entities.push(ground);

	start();
}