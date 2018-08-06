export function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randColor() {
	return '#' + Math.floor(Math.random() * 16777215).toString(16);
}