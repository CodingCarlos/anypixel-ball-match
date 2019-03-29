/*
TO_DO @CodingCarlos: 
 [ ] Adapt to the Campus London anypixel
 [ ] Use circles instead of squares
 [ ] Improve collissions
 [ ] Modularize the code
*/

var anypixel = require('anypixel'); 
var ctx = anypixel.canvas.getContext2D();

// Set height and width variables
var INC_W = anypixel.config.width;
var INC_H = anypixel.config.height;

let interval = null;
const INTERVAL_TIME = 10;

const RESTART_TIME = 5;

const BALL_SIZE = 5;

const COLOR_L = '#F00';
const COLOR_R = '#00F';

let POINTS_L = Math.floor(INC_W / 2);
let POINTS_R = Math.floor(INC_W / 2);

const elemL = [];
const elemR = [];

let gameEnded = true;
let resarting = false;
let seccondsLeft = 0;

/**
 * On load, draw a square
 */
document.addEventListener('DOMContentLoaded', start);

/**
 * On button down, clear the wall
 */
// document.addEventListener('onButtonDown', function(event) {}

document.addEventListener('onButtonUp', function(event) {
  if (event.detail.x < INC_W / 2) {
    addBall(elemL, COLOR_L, event.detail);
  } else {
    addBall(elemR, COLOR_R, event.detail);
  }
});


/**
 * Init game and interval
 */
function start() {
	clear();
  gameEnded = false;
  interval = setInterval(run, INTERVAL_TIME);
}

/**
 * Execute each game frame ^^
 */
function run () {
  calculate();
  clear();
  draw();

  if (isEndOfTheGame()) {
    gameEnded = true;
    prepareRestart();
  }
}

/**
 * Calculate the new position for every item in screen
 */
function calculate() {
  // Reposition L
  for (var i = 0; i < elemL.length; i++) {
    const l = elemL[i];
    if(l.x === INC_W + BALL_SIZE) {
      // If bounded, remove element
      elemL.splice(i, 1);

      // And update counters
      counterAddPoint('left');
    } else {
      l.x += 1;
    }
  }

  // Reposition R
  for (var i = 0; i < elemR.length; i++) {
    const r = elemR[i];
    if(r.x === -BALL_SIZE) {
      // If bounded, remove element
      elemR.splice(i, 1);

      // And update counters
      counterAddPoint('right');
    } else {
      r.x -= 1;
    }
  }

  // Calculate collisions
  for (var i = 0; i < elemL.length; i++) {
    const l = elemL[i];

    // Between balls
    for (var j = 0; j < elemR.length; j++) {
      const r = elemR[j]
      if (l.x + BALL_SIZE >= r.x  
      && l.y - r.y > -5
      && l.y - r.y > -5){
        elemL.splice(i, 1);
        elemR.splice(j, 1);
      }
    }
  }
  return true;
}

/**
 *  Draw every element in the screen
 */
function draw() {
  // Balls
  drawBalls(elemL);
  drawBalls(elemR);

  // Points
  drawPoints();

  // Game Over
  if (gameEnded === true) {
    drawGameOver();
  }
}

/**
 * Draw a ball list in the canvas
 * @param list [Array] The ball list to draw
 */
function drawBalls(list) {
  for (var i = 0; i < list.length; i++) {
    const e = list[i];

    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, BALL_SIZE, BALL_SIZE)
  }
}

/**
 * Draws the score bar
 */
function drawPoints() {
  ctx.fillStyle = COLOR_L;
  ctx.fillRect(0, 0, POINTS_L, BALL_SIZE)

  ctx.fillStyle = COLOR_R;
  ctx.fillRect((INC_W - POINTS_R), 0, POINTS_R, BALL_SIZE)
}

/**
 * Draws the Game Over menu
 */
function drawGameOver() {
  if (POINTS_L > POINTS_R) {
    ctx.fillStyle = COLOR_L;
  } else {
    ctx.fillStyle = COLOR_R;
  }
  ctx.font = "42px";
  ctx.fillText('GAME OVER', 40, 20);

  ctx.fillText(seccondsLeft, INC_W / 2 - 2, 30);

}

/**
 * Checks if game is ended or not (by points)
 *
 * @return Boolean Game ended or not
 */
function isEndOfTheGame() {
  if (POINTS_R >= INC_W) {
    return true;
  } else if (POINTS_L >= INC_W) {
    return true;    
  }
    
  return false;
}

/**
 * Prepare environment and countdown to restart
 */
function prepareRestart() {
  if (!resarting) {
    resarting = true;
    seccondsLeft = RESTART_TIME;
    setTimeout(secondLess, 1000);
  }
}

/**
 * Count down
 */
function secondLess() {
  seccondsLeft -= 1;

  if(seccondsLeft > 0) {
    setTimeout(secondLess, 1000);
  } else {
    restart();
  }
}

/**
 * Restart the game
 */
function restart() {
  POINTS_L = Math.floor(INC_W / 2);
  POINTS_R = Math.floor(INC_W / 2);
  gameEnded = false;
  resarting = false;
}

/**
 * Add a ball to a list
 *
 * @param list [Array] List to add the item
 * @param color String Color for the ball
 * @param position Object Initial position ({x, y}) for the ball
 */
function addBall(list, color, position) {
  if (gameEnded) {
    return false;
  }

  let x = position.x - 2;
  let y = position.y - 2;

  list.push({
    color,
    x,
    y,
  });
}

/**
 * Add a point to a player
 *
 * @param to String Player to add the point. Values 'left' or 'right' allowed.
 */
function counterAddPoint(to) {
  if (to.toLowerCase() === 'left') {
    POINTS_L += 1;
    POINTS_R -= 1;
  } else if (to.toLowerCase() === 'right') {
    POINTS_R += 1;
    POINTS_L -= 1;
  }
}

/**
 * Clear screen
 */
function clear() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, INC_W, INC_H)
}
