export class Trait {
	constructor(name) {
		this.name = name;
	}

	update(entity, deltaTime) {
	}

	init(entity) {
	}
}

export class BoundaryCheck extends Trait {
	constructor(canvas) {
		super('boundaryCheck');
		
		this.top = 0;
		this.bottom = canvas.height;
		this.left = 0;
		this.right = canvas.width;
	}

	update(entity) {
		const isGoingRight = entity.vel.x > 0;
		const isGoingDown = entity.vel.y > 0;

		if (entity.pos.x + entity.size.x >= this.right && isGoingRight) {

			if (entity.vel.x > 150) {
				entity.vel.x *= -1;
			} else {
				entity.stopX();
			}
			
			entity.pos.x = this.right - entity.size.x;
		} else if (entity.pos.x <= this.left && !isGoingRight) {
			entity.stopX();
			entity.pos.x = 0;
		}

		if (entity.pos.y + entity.size.y >= this.bottom && isGoingDown) {
			entity.stopY();
			entity.pos.y = this.bottom - entity.size.y;
			entity.onGround = true;
			entity.dead = true;
			
		} else if (entity.pos.y <= this.top && !isGoingDown) {
			entity.stopY();
			entity.pos.y = 0;
		}
	}
}

export class DebugEntity extends Trait {
	constructor(ctx) {
		super('debugentity');

		this.enabled = true;
		this.context = ctx;
	}

	update(entity, deltaTime) {
		let vel = entity.vel.toString();
		let pos = entity.pos.toString();

		this.context.fillStyle = '#eee';
		this.context.font = "16px Arial";
		this.context.fillText(`Entity Debug`, 10, 20);
		this.context.fillText(`Pos: ${pos}`, 10, 40);
		this.context.fillText(`Vel: ${vel}`, 10, 60);
	}
}

export class DebugPlayer extends Trait {
	constructor(ctx) {
		super('debugplayer');

		this.enabled = true;
		this.context = ctx;
	}

	update(entity, deltaTime) {
		let vel = entity.vel.toString();
		let pos = entity.pos.toString();
		let jump = `{onGround: ${entity.onGround}}`

		this.context.fillStyle = '#eee';
		this.context.font = "14px Arial"
		this.context.fillText(`Player Debug`, 10, 10);
		this.context.fillText(`Pos: ${pos}`, 10, 28);
		this.context.fillText(`Vel: ${vel}`, 10, 46);
		this.context.fillText(`Jump: ${jump}`, 10, 64);
	}
}