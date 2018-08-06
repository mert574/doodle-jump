import Vec from "../helpers/Vec.js";

export default class Entity {
	constructor(type, pos, size, vel) {
		this.type = type;
		this.pos = pos;
		this.size = size;
		this.vel = vel || new Vec(0,0);

		this.color = '#eee';
		this.friction = 4000;
		this.gravity = 4000;
		this.collision = false;
		this.onGround = false;
		this.drawable = false;

		this._traits = [];
		this._traitNames = {};
		this._velQueue = new Vec(0, 0);
	}

	changeColor(color) {
		this.color = color;
	}

	addTrait(trait) {
		this._traitNames[trait.name] = this._traits.push(trait);
	}

	traitIndex(name) {
		return this._traitNames[name];
	}

	addVelocity(x=0, y=0) {
		if (x != 0) {
			const totalX = this.vel.x + x;
			
			const signX = Math.sign(x);
			const signTotalX = Math.sign(totalX);

			if (signX != signTotalX) {
				this.vel.x = x;
			} else {
				if (signTotalX == +1) {
					this.vel.x = Math.min(totalX, this.maxVelocity.x);
				} else if (signTotalX == -1) {
					this.vel.x = Math.max(totalX, -this.maxVelocity.x);
				}
			}
		}

		if (y != 0) {
			const totalY = this.vel.y + y;
			
			const signY = Math.sign(y);
			const signTotalY = Math.sign(totalY);

			if (signY != signTotalY) {
				this.vel.y = y;
			} else {
				if (signY == +1) {
					this.vel.y = Math.min(totalY, this.maxVelocity.y);
				} else if (signY == -1) {
					this.vel.y = Math.max(totalY, -this.maxVelocity.y);
				}
			}
		}
	}

	stopX() {
		this.vel.x = 0;
	}

	stopY() {
		this.vel.y = 0;
	}

	update(deltaTime) {
		for (let trait of this._traits) {
			trait.update(this, deltaTime);
		}

		if (this.vel.x > 0) {
			this.vel.x -= this.friction * deltaTime;
			
			if (this.vel.x < 0) {
				this.vel.x = 0;
			}

		} else if (this.vel.x < 0) {
			this.vel.x += this.friction * deltaTime;
			
			if (this.vel.x > 0) {
				this.vel.x = 0;
			}
		}

		if (this.gravity && !this.onGround)
			this.vel.y += this.gravity * deltaTime;
	}

	updatePositions(deltaTime) {
		this.pos.x += this.vel.x * deltaTime;
		this.pos.y += this.vel.y * deltaTime;
	}

	draw(context) {
		context.fillStyle = this.color;
		context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

		context.beginPath();
		context.strokeStyle = '#000';
		context.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		context.stroke();
		
	}

	get left() 	 { return this.pos.x; }
	get right()	 { return this.pos.x + this.size.x; }
	get top() 	 { return this.pos.y; }
	get bottom() { return this.pos.y + this.size.y; }

	get centerX() { return this.pos.x + this.size.x * 0.5; }
	get centerY() { return this.pos.y + this.size.y * 0.5; }
}

export class Solid extends Entity {
	constructor(pos, size, vel) {
		super('solid', pos, size, vel);

		this.collision = true;
		this.drawable = true;
		this.collidingWith;
	}

	toggleCollision() {
		this.collision = !this.collision;
	}

	toggleDraw() {
		this.drawable = !this.drawable;
	}

	checkCollision(entity) {

		const isColliding = this.collision
			&& this.bottom >= entity.top
			&& this.top <= entity.bottom
			&& this.right >= entity.left
			&& this.left <= entity.right;

		return isColliding;
	}

	resolveCollision(entity) {
		if (entity.pos.y >= this.pos.y && this.vel.y > 0) {
			
			this.collidingWith = entity;
			this.onGround = true;

			//this.stopY();
			this.pos.y = entity.pos.y - this.size.y;

			const checkContinously = () => {
				if (!this.checkCollision(this.collidingWith)) {
					this.onGround = false;
				} else {
					requestAnimationFrame(checkContinously);
				}
			}

			checkContinously();
		}
	}
}

export class Player extends Solid {
	constructor(pos, size, vel) {
		super(pos, size, vel);
		this.type = 'player';
		this.score = 0;

		this.friction = 9000;
		this.gravity = 4000;
		this.maxVelocity = new Vec(900, 3000);
		this.dead = false;
	}
}

export class Wall extends Solid {
	constructor(pos, width) {

		super(pos, 
			new Vec(width, 24), 
			new Vec(0, 0));

		this.type = 'wall';
		this.collision = true;
		this.drawable = true;
		this.gravity = 0;
	}
}