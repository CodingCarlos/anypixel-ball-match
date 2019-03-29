var anypixel = require('anypixel'); 
var ctx = anypixel.canvas.getContext2D();

// this enable to update vars from the Browser
// var dat = require('exdat');
// var gui;
// var guiObject = {
// 	speed: 0.5,
// 	detourLength: 0.5
// }

var colors = ['#F00', '#0F0', '#00F'];
var INC_W = anypixel.config.width;
var INC_H = anypixel.config.height;

document.addEventListener('DOMContentLoaded', function() {
	console.log('asddd');
	interface();
});

/**
 * Draw the reset zone
 */
 function interface() {
 	console.log('starting');
	// gui = new dat.GUI();
 	// gui.add(guiObject, 'detourLength', 0, 1.0).step(0.00005);
 	ctx.fillStyle = '#F00';
 	ctx.fillRect(0, 35, 7, 7);
 	// ctx.fillRect(0, 0, INC_W, INC_H);
	ctx.fillText('Hello world', 10, 10);
 }

/**  
 * * Listen for onButtonDown events and draw a 2x2 rectangle at the event site
 */
document.addEventListener('onButtonDown', function(event) {   
	// console.log(event);
	// console.log(event.detail);
	
	if (event.detail.x < 8 && event.detail.y >= 35) {
		console.log('clear!');
		console.log(ctx);
		// console.log(guiObject);
		// ctx.clear();
 		ctx.fillRect(0, 0, INC_W, INC_H);
		// ctx.clearRect(0, 0, 130, 25);
		return false;
	}

	ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
	ctx.fillRect(event.detail.x - 1, event.detail.y - 1, 2, 2);
});

