export default class Controller {
	constructor(player) {
		this.player = player;

		this.movement = {
			'left': false,
			'right': false,
			'down': false,
			'jump': false
		}

		this.jumpState = 0;

		this.keys = {
			'39': 'right',
			'68': 'right',
			
			'40': 'down',
			'83': 'down',
			
			'37': 'left',
			'65': 'left',
			
			'32': 'jump',
			'87': 'jump',
			'38': 'jump',

		}

		this.moveSpeed = 300;
		this.jumpSpeed = 1500;
		this.eventListeners = {};

		window.addEventListener("keydown", e => this._keyDown(e), false);
		window.addEventListener("keyup", e => this._keyUp(e), false);

		this.update();
	}

	_keyDown(e) {
		for(const keyCode in this.keys)
			if (keyCode == e.keyCode) {
				e.preventDefault();

				const key = this.keys[keyCode];
				!this.movement[key] && this._startMovement(key)
			}
	}

	_keyUp(e) {
		for (const keyCode in this.keys)
			if (keyCode == e.keyCode) {
				e.preventDefault();
				this._stopMovement(this.keys[keyCode])
			}
	}

	onEvent(direction, callback) {
		if (!this.eventListeners[direction])
			this.eventListeners[direction] = []

		this.eventListeners[direction].push(callback)
	}

	_checkOnEvent(direction, value) {
		if (this.eventListeners[direction]) {
			for (let cb of this.eventListeners[direction]) {
				if (typeof cb == 'function')
					cb(value, this.player)
			}
		}
	}

	_startMovement(direction) {

		if ((direction == 'jump' && this.jumpState < 2) || direction != 'jump')
			this._checkOnEvent(direction, 1)

		switch (direction) {
			case 'left':
				this.movement.left = true;
				break;
			case 'right':
				this.movement.right = true;
				break;
			case 'up':
				this.movement.up = true;
				break;
			case 'down':
				this.movement.down = true;
				break;
			case 'jump':
				this.movement.jump = true;
				this.jump(); //special
				break;
		}
	}

	_stopMovement(direction) {
		
		this._checkOnEvent(direction, 0)

		switch (direction) {
			case 'left':
				this.movement.left = false;
				break;
			case 'right':
				this.movement.right = false;
				break;
			case 'up':
				this.movement.up = false;
				break;
			case 'down':
				this.movement.down = false;
				break;
			case 'jump':
				this.movement.jump = false;
				break;
		}

		
	}

	setKey(keyCode, event) {
		this.keys[keyCode] = event;
	}

	toggleMovement(direction) {
		this.movement[direction] = !this.movement[direction]
	}

	update(deltaTime) {
		if (this.movement.left) {
			this.player.addVelocity(-this.moveSpeed)
		} else if (this.movement.right) {
			this.player.addVelocity(this.moveSpeed)
		}

		if (this.movement.down) {
			this.player.addVelocity(0, this.moveSpeed);
		}

		if (this.jumpState && this.player.onGround) {
			this.jumpState = 0;
		}

		requestAnimationFrame(()=>this.update())
	}

	jump() {
		if (this.jumpState < 2) {
			this.player.onGround = false;
			this.jumpState++;
			this.player.stopY();
			this.player.addVelocity(0, -this.jumpSpeed);
		}
	}
}