(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

module.exports = require('./lib/anypixel');

},{"./lib/anypixel":2}],2:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

module.exports.config = require('./config');
module.exports.canvas = require('./canvas');
module.exports.events = require('./events');
module.exports.events.setStateListenerOn(document);

},{"./canvas":3,"./config":4,"./events":5}],3:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

var config = require('./config');
var canvas = module.exports = {};

var domCanvas = document.getElementById(config.canvasId);

domCanvas.width = config.width;
domCanvas.height = config.height;

/**
 * Returns the 2D canvas context
 */
canvas.getContext2D = function getContext2D() {
	return domCanvas.getContext('2d');
}

/**
 * Returns the 3D canvas context
 */
canvas.getContext3D = function getContext3D() {
	return domCanvas.getContext('webgl', {preserveDrawingBuffer: true});
}
},{"./config":4}],4:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

/**
 * Expose some configuration data. The user can overwrite this if their setup is different.
 */
var config = module.exports = {};

config.canvasId = 'button-canvas';
config.width = 140;
config.height = 42;
},{}],5:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

/**
 * Listen for the 'buttonStates' event from a DOM target and emit onButtonDown / Up events
 * depending on the reported button state
 */
var events = module.exports = {};

events.setStateListenerOn = function setStateListenerOn(target) {
		
	if (target.anypixelListener) {
		return;
	}
	
	target.anypixelListener = true;

	target.addEventListener('buttonStates', function(data) {
		data.detail.forEach(function(button) {
			var x = button.p.x;
			var y = button.p.y;
			var state = button.s;
			var event = state === 1 ? 'onButtonDown' : 'onButtonUp';
			var key = x + ':' + y;

			if (state === 1) {
				events.pushedButtons[key] = {x: x, y: y};
			} else {
				delete events.pushedButtons[key];
			}
			
			target.dispatchEvent(new CustomEvent(event, {detail: {x: x, y: y}}));
		});
	});
}

/**
 * A map of currently-pushed buttons, provided for utility
 */
events.pushedButtons = {};

},{}],6:[function(require,module,exports){
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
const INTERVAL_TIME = 20;

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

},{"anypixel":1}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92OS44LjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYW55cGl4ZWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW55cGl4ZWwvbGliL2FueXBpeGVsLmpzIiwibm9kZV9tb2R1bGVzL2FueXBpeGVsL2xpYi9jYW52YXMuanMiLCJub2RlX21vZHVsZXMvYW55cGl4ZWwvbGliL2NvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy9hbnlwaXhlbC9saWIvZXZlbnRzLmpzIiwic3JjL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvbGljZW5zZS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBsaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9hbnlwaXhlbCcpO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9saWNlbnNlLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIGxpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cy5jb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xubW9kdWxlLmV4cG9ydHMuY2FudmFzID0gcmVxdWlyZSgnLi9jYW52YXMnKTtcbm1vZHVsZS5leHBvcnRzLmV2ZW50cyA9IHJlcXVpcmUoJy4vZXZlbnRzJyk7XG5tb2R1bGUuZXhwb3J0cy5ldmVudHMuc2V0U3RhdGVMaXN0ZW5lck9uKGRvY3VtZW50KTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvbGljZW5zZS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBsaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XG52YXIgY2FudmFzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudmFyIGRvbUNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbmZpZy5jYW52YXNJZCk7XG5cbmRvbUNhbnZhcy53aWR0aCA9IGNvbmZpZy53aWR0aDtcbmRvbUNhbnZhcy5oZWlnaHQgPSBjb25maWcuaGVpZ2h0O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIDJEIGNhbnZhcyBjb250ZXh0XG4gKi9cbmNhbnZhcy5nZXRDb250ZXh0MkQgPSBmdW5jdGlvbiBnZXRDb250ZXh0MkQoKSB7XG5cdHJldHVybiBkb21DYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSAzRCBjYW52YXMgY29udGV4dFxuICovXG5jYW52YXMuZ2V0Q29udGV4dDNEID0gZnVuY3Rpb24gZ2V0Q29udGV4dDNEKCkge1xuXHRyZXR1cm4gZG9tQ2FudmFzLmdldENvbnRleHQoJ3dlYmdsJywge3ByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZX0pO1xufSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvbGljZW5zZS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBsaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBFeHBvc2Ugc29tZSBjb25maWd1cmF0aW9uIGRhdGEuIFRoZSB1c2VyIGNhbiBvdmVyd3JpdGUgdGhpcyBpZiB0aGVpciBzZXR1cCBpcyBkaWZmZXJlbnQuXG4gKi9cbnZhciBjb25maWcgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5jb25maWcuY2FudmFzSWQgPSAnYnV0dG9uLWNhbnZhcyc7XG5jb25maWcud2lkdGggPSAxNDA7XG5jb25maWcuaGVpZ2h0ID0gNDI7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9saWNlbnNlLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIGxpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIExpc3RlbiBmb3IgdGhlICdidXR0b25TdGF0ZXMnIGV2ZW50IGZyb20gYSBET00gdGFyZ2V0IGFuZCBlbWl0IG9uQnV0dG9uRG93biAvIFVwIGV2ZW50c1xuICogZGVwZW5kaW5nIG9uIHRoZSByZXBvcnRlZCBidXR0b24gc3RhdGVcbiAqL1xudmFyIGV2ZW50cyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmV2ZW50cy5zZXRTdGF0ZUxpc3RlbmVyT24gPSBmdW5jdGlvbiBzZXRTdGF0ZUxpc3RlbmVyT24odGFyZ2V0KSB7XG5cdFx0XG5cdGlmICh0YXJnZXQuYW55cGl4ZWxMaXN0ZW5lcikge1xuXHRcdHJldHVybjtcblx0fVxuXHRcblx0dGFyZ2V0LmFueXBpeGVsTGlzdGVuZXIgPSB0cnVlO1xuXG5cdHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdidXR0b25TdGF0ZXMnLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0ZGF0YS5kZXRhaWwuZm9yRWFjaChmdW5jdGlvbihidXR0b24pIHtcblx0XHRcdHZhciB4ID0gYnV0dG9uLnAueDtcblx0XHRcdHZhciB5ID0gYnV0dG9uLnAueTtcblx0XHRcdHZhciBzdGF0ZSA9IGJ1dHRvbi5zO1xuXHRcdFx0dmFyIGV2ZW50ID0gc3RhdGUgPT09IDEgPyAnb25CdXR0b25Eb3duJyA6ICdvbkJ1dHRvblVwJztcblx0XHRcdHZhciBrZXkgPSB4ICsgJzonICsgeTtcblxuXHRcdFx0aWYgKHN0YXRlID09PSAxKSB7XG5cdFx0XHRcdGV2ZW50cy5wdXNoZWRCdXR0b25zW2tleV0gPSB7eDogeCwgeTogeX07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkZWxldGUgZXZlbnRzLnB1c2hlZEJ1dHRvbnNba2V5XTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50LCB7ZGV0YWlsOiB7eDogeCwgeTogeX19KSk7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG4vKipcbiAqIEEgbWFwIG9mIGN1cnJlbnRseS1wdXNoZWQgYnV0dG9ucywgcHJvdmlkZWQgZm9yIHV0aWxpdHlcbiAqL1xuZXZlbnRzLnB1c2hlZEJ1dHRvbnMgPSB7fTtcbiIsIi8qXG5UT19ETyBAQ29kaW5nQ2FybG9zOiBcbiBbIF0gQWRhcHQgdG8gdGhlIENhbXB1cyBMb25kb24gYW55cGl4ZWxcbiBbIF0gVXNlIGNpcmNsZXMgaW5zdGVhZCBvZiBzcXVhcmVzXG4gWyBdIEltcHJvdmUgY29sbGlzc2lvbnNcbiBbIF0gTW9kdWxhcml6ZSB0aGUgY29kZVxuKi9cblxudmFyIGFueXBpeGVsID0gcmVxdWlyZSgnYW55cGl4ZWwnKTsgXG52YXIgY3R4ID0gYW55cGl4ZWwuY2FudmFzLmdldENvbnRleHQyRCgpO1xuXG4vLyBTZXQgaGVpZ2h0IGFuZCB3aWR0aCB2YXJpYWJsZXNcbnZhciBJTkNfVyA9IGFueXBpeGVsLmNvbmZpZy53aWR0aDtcbnZhciBJTkNfSCA9IGFueXBpeGVsLmNvbmZpZy5oZWlnaHQ7XG5cbmxldCBpbnRlcnZhbCA9IG51bGw7XG5jb25zdCBJTlRFUlZBTF9USU1FID0gMjA7XG5cbmNvbnN0IFJFU1RBUlRfVElNRSA9IDU7XG5cbmNvbnN0IEJBTExfU0laRSA9IDU7XG5cbmNvbnN0IENPTE9SX0wgPSAnI0YwMCc7XG5jb25zdCBDT0xPUl9SID0gJyMwMEYnO1xuXG5sZXQgUE9JTlRTX0wgPSBNYXRoLmZsb29yKElOQ19XIC8gMik7XG5sZXQgUE9JTlRTX1IgPSBNYXRoLmZsb29yKElOQ19XIC8gMik7XG5cbmNvbnN0IGVsZW1MID0gW107XG5jb25zdCBlbGVtUiA9IFtdO1xuXG5sZXQgZ2FtZUVuZGVkID0gdHJ1ZTtcbmxldCByZXNhcnRpbmcgPSBmYWxzZTtcbmxldCBzZWNjb25kc0xlZnQgPSAwO1xuXG4vKipcbiAqIE9uIGxvYWQsIGRyYXcgYSBzcXVhcmVcbiAqL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIHN0YXJ0KTtcblxuLyoqXG4gKiBPbiBidXR0b24gZG93biwgY2xlYXIgdGhlIHdhbGxcbiAqL1xuLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignb25CdXR0b25Eb3duJywgZnVuY3Rpb24oZXZlbnQpIHt9XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ29uQnV0dG9uVXAnLCBmdW5jdGlvbihldmVudCkge1xuICBpZiAoZXZlbnQuZGV0YWlsLnggPCBJTkNfVyAvIDIpIHtcbiAgICBhZGRCYWxsKGVsZW1MLCBDT0xPUl9MLCBldmVudC5kZXRhaWwpO1xuICB9IGVsc2Uge1xuICAgIGFkZEJhbGwoZWxlbVIsIENPTE9SX1IsIGV2ZW50LmRldGFpbCk7XG4gIH1cbn0pO1xuXG5cbi8qKlxuICogSW5pdCBnYW1lIGFuZCBpbnRlcnZhbFxuICovXG5mdW5jdGlvbiBzdGFydCgpIHtcblx0Y2xlYXIoKTtcbiAgZ2FtZUVuZGVkID0gZmFsc2U7XG4gIGludGVydmFsID0gc2V0SW50ZXJ2YWwocnVuLCBJTlRFUlZBTF9USU1FKTtcbn1cblxuLyoqXG4gKiBFeGVjdXRlIGVhY2ggZ2FtZSBmcmFtZSBeXlxuICovXG5mdW5jdGlvbiBydW4gKCkge1xuICBjYWxjdWxhdGUoKTtcbiAgY2xlYXIoKTtcbiAgZHJhdygpO1xuXG4gIGlmIChpc0VuZE9mVGhlR2FtZSgpKSB7XG4gICAgZ2FtZUVuZGVkID0gdHJ1ZTtcbiAgICBwcmVwYXJlUmVzdGFydCgpO1xuICB9XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBuZXcgcG9zaXRpb24gZm9yIGV2ZXJ5IGl0ZW0gaW4gc2NyZWVuXG4gKi9cbmZ1bmN0aW9uIGNhbGN1bGF0ZSgpIHtcbiAgLy8gUmVwb3NpdGlvbiBMXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbUwubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBsID0gZWxlbUxbaV07XG4gICAgaWYobC54ID09PSBJTkNfVyArIEJBTExfU0laRSkge1xuICAgICAgLy8gSWYgYm91bmRlZCwgcmVtb3ZlIGVsZW1lbnRcbiAgICAgIGVsZW1MLnNwbGljZShpLCAxKTtcblxuICAgICAgLy8gQW5kIHVwZGF0ZSBjb3VudGVyc1xuICAgICAgY291bnRlckFkZFBvaW50KCdsZWZ0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGwueCArPSAxO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlcG9zaXRpb24gUlxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1SLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgciA9IGVsZW1SW2ldO1xuICAgIGlmKHIueCA9PT0gLUJBTExfU0laRSkge1xuICAgICAgLy8gSWYgYm91bmRlZCwgcmVtb3ZlIGVsZW1lbnRcbiAgICAgIGVsZW1SLnNwbGljZShpLCAxKTtcblxuICAgICAgLy8gQW5kIHVwZGF0ZSBjb3VudGVyc1xuICAgICAgY291bnRlckFkZFBvaW50KCdyaWdodCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByLnggLT0gMTtcbiAgICB9XG4gIH1cblxuICAvLyBDYWxjdWxhdGUgY29sbGlzaW9uc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1MLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgbCA9IGVsZW1MW2ldO1xuXG4gICAgLy8gQmV0d2VlbiBiYWxsc1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgZWxlbVIubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHIgPSBlbGVtUltqXVxuICAgICAgaWYgKGwueCArIEJBTExfU0laRSA+PSByLnggIFxuICAgICAgJiYgbC55IC0gci55ID4gLTVcbiAgICAgICYmIGwueSAtIHIueSA+IC01KXtcbiAgICAgICAgZWxlbUwuc3BsaWNlKGksIDEpO1xuICAgICAgICBlbGVtUi5zcGxpY2UoaiwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqICBEcmF3IGV2ZXJ5IGVsZW1lbnQgaW4gdGhlIHNjcmVlblxuICovXG5mdW5jdGlvbiBkcmF3KCkge1xuICAvLyBCYWxsc1xuICBkcmF3QmFsbHMoZWxlbUwpO1xuICBkcmF3QmFsbHMoZWxlbVIpO1xuXG4gIC8vIFBvaW50c1xuICBkcmF3UG9pbnRzKCk7XG5cbiAgLy8gR2FtZSBPdmVyXG4gIGlmIChnYW1lRW5kZWQgPT09IHRydWUpIHtcbiAgICBkcmF3R2FtZU92ZXIoKTtcbiAgfVxufVxuXG4vKipcbiAqIERyYXcgYSBiYWxsIGxpc3QgaW4gdGhlIGNhbnZhc1xuICogQHBhcmFtIGxpc3QgW0FycmF5XSBUaGUgYmFsbCBsaXN0IHRvIGRyYXdcbiAqL1xuZnVuY3Rpb24gZHJhd0JhbGxzKGxpc3QpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZSA9IGxpc3RbaV07XG5cbiAgICBjdHguZmlsbFN0eWxlID0gZS5jb2xvcjtcbiAgICBjdHguZmlsbFJlY3QoZS54LCBlLnksIEJBTExfU0laRSwgQkFMTF9TSVpFKVxuICB9XG59XG5cbi8qKlxuICogRHJhd3MgdGhlIHNjb3JlIGJhclxuICovXG5mdW5jdGlvbiBkcmF3UG9pbnRzKCkge1xuICBjdHguZmlsbFN0eWxlID0gQ09MT1JfTDtcbiAgY3R4LmZpbGxSZWN0KDAsIDAsIFBPSU5UU19MLCBCQUxMX1NJWkUpXG5cbiAgY3R4LmZpbGxTdHlsZSA9IENPTE9SX1I7XG4gIGN0eC5maWxsUmVjdCgoSU5DX1cgLSBQT0lOVFNfUiksIDAsIFBPSU5UU19SLCBCQUxMX1NJWkUpXG59XG5cbi8qKlxuICogRHJhd3MgdGhlIEdhbWUgT3ZlciBtZW51XG4gKi9cbmZ1bmN0aW9uIGRyYXdHYW1lT3ZlcigpIHtcbiAgaWYgKFBPSU5UU19MID4gUE9JTlRTX1IpIHtcbiAgICBjdHguZmlsbFN0eWxlID0gQ09MT1JfTDtcbiAgfSBlbHNlIHtcbiAgICBjdHguZmlsbFN0eWxlID0gQ09MT1JfUjtcbiAgfVxuICBjdHguZm9udCA9IFwiNDJweFwiO1xuICBjdHguZmlsbFRleHQoJ0dBTUUgT1ZFUicsIDQwLCAyMCk7XG5cbiAgY3R4LmZpbGxUZXh0KHNlY2NvbmRzTGVmdCwgSU5DX1cgLyAyIC0gMiwgMzApO1xuXG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGdhbWUgaXMgZW5kZWQgb3Igbm90IChieSBwb2ludHMpXG4gKlxuICogQHJldHVybiBCb29sZWFuIEdhbWUgZW5kZWQgb3Igbm90XG4gKi9cbmZ1bmN0aW9uIGlzRW5kT2ZUaGVHYW1lKCkge1xuICBpZiAoUE9JTlRTX1IgPj0gSU5DX1cpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChQT0lOVFNfTCA+PSBJTkNfVykge1xuICAgIHJldHVybiB0cnVlOyAgICBcbiAgfVxuICAgIFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUHJlcGFyZSBlbnZpcm9ubWVudCBhbmQgY291bnRkb3duIHRvIHJlc3RhcnRcbiAqL1xuZnVuY3Rpb24gcHJlcGFyZVJlc3RhcnQoKSB7XG4gIGlmICghcmVzYXJ0aW5nKSB7XG4gICAgcmVzYXJ0aW5nID0gdHJ1ZTtcbiAgICBzZWNjb25kc0xlZnQgPSBSRVNUQVJUX1RJTUU7XG4gICAgc2V0VGltZW91dChzZWNvbmRMZXNzLCAxMDAwKTtcbiAgfVxufVxuXG4vKipcbiAqIENvdW50IGRvd25cbiAqL1xuZnVuY3Rpb24gc2Vjb25kTGVzcygpIHtcbiAgc2VjY29uZHNMZWZ0IC09IDE7XG5cbiAgaWYoc2VjY29uZHNMZWZ0ID4gMCkge1xuICAgIHNldFRpbWVvdXQoc2Vjb25kTGVzcywgMTAwMCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdGFydCgpO1xuICB9XG59XG5cbi8qKlxuICogUmVzdGFydCB0aGUgZ2FtZVxuICovXG5mdW5jdGlvbiByZXN0YXJ0KCkge1xuICBQT0lOVFNfTCA9IE1hdGguZmxvb3IoSU5DX1cgLyAyKTtcbiAgUE9JTlRTX1IgPSBNYXRoLmZsb29yKElOQ19XIC8gMik7XG4gIGdhbWVFbmRlZCA9IGZhbHNlO1xuICByZXNhcnRpbmcgPSBmYWxzZTtcbn1cblxuLyoqXG4gKiBBZGQgYSBiYWxsIHRvIGEgbGlzdFxuICpcbiAqIEBwYXJhbSBsaXN0IFtBcnJheV0gTGlzdCB0byBhZGQgdGhlIGl0ZW1cbiAqIEBwYXJhbSBjb2xvciBTdHJpbmcgQ29sb3IgZm9yIHRoZSBiYWxsXG4gKiBAcGFyYW0gcG9zaXRpb24gT2JqZWN0IEluaXRpYWwgcG9zaXRpb24gKHt4LCB5fSkgZm9yIHRoZSBiYWxsXG4gKi9cbmZ1bmN0aW9uIGFkZEJhbGwobGlzdCwgY29sb3IsIHBvc2l0aW9uKSB7XG4gIGlmIChnYW1lRW5kZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBsZXQgeCA9IHBvc2l0aW9uLnggLSAyO1xuICBsZXQgeSA9IHBvc2l0aW9uLnkgLSAyO1xuXG4gIGxpc3QucHVzaCh7XG4gICAgY29sb3IsXG4gICAgeCxcbiAgICB5LFxuICB9KTtcbn1cblxuLyoqXG4gKiBBZGQgYSBwb2ludCB0byBhIHBsYXllclxuICpcbiAqIEBwYXJhbSB0byBTdHJpbmcgUGxheWVyIHRvIGFkZCB0aGUgcG9pbnQuIFZhbHVlcyAnbGVmdCcgb3IgJ3JpZ2h0JyBhbGxvd2VkLlxuICovXG5mdW5jdGlvbiBjb3VudGVyQWRkUG9pbnQodG8pIHtcbiAgaWYgKHRvLnRvTG93ZXJDYXNlKCkgPT09ICdsZWZ0Jykge1xuICAgIFBPSU5UU19MICs9IDE7XG4gICAgUE9JTlRTX1IgLT0gMTtcbiAgfSBlbHNlIGlmICh0by50b0xvd2VyQ2FzZSgpID09PSAncmlnaHQnKSB7XG4gICAgUE9JTlRTX1IgKz0gMTtcbiAgICBQT0lOVFNfTCAtPSAxO1xuICB9XG59XG5cbi8qKlxuICogQ2xlYXIgc2NyZWVuXG4gKi9cbmZ1bmN0aW9uIGNsZWFyKCkge1xuICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICBjdHguZmlsbFJlY3QoMCwgMCwgSU5DX1csIElOQ19IKVxufVxuIl19
