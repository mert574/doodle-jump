/*
Actually it would be named better as 'Vec2' or 'Vec2d' 
but the game itself is 2d only. 
I don't think it's necessary to say it's 2d again.
*/
export default class Vec {
	constructor(x=0, y=0) {
		this.x = x;
		this.y = y;
	}

	add(x=0, y=0) {
		this.x += x
		this.y += y
	}

	sub(x=0, y=0) {
		this.x -= x
		this.y -= y
	}

	get len() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}

	toString() {
		return `{X:${this.x.toFixed(2)}, Y:${this.y.toFixed(2)}}`;
	}
}