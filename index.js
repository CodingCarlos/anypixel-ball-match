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

QUE QUEDA: 
 - Reinciar el juego cuando acabe (en varios segundos, idealmente mostrando un contador)
 - Adaptarlo a la pantalla de Londres T_T

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

function draw() {
  for (var i = 0; i < elemL.length; i++) {
    const e = elemL[i];

    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, BALL_SIZE, BALL_SIZE)
  }
  for (var i = 0; i < elemR.length; i++) {
    const e = elemR[i];

    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, BALL_SIZE, BALL_SIZE)
  }

  drawPoints();

  if (gameEnded === true) {
    console.log('Game Over');
    drawGameOver();
  }

  return true;
}

function drawPoints() {
  ctx.fillStyle = COLOR_L;
  ctx.fillRect(0, 0, POINTS_L, BALL_SIZE)

  ctx.fillStyle = COLOR_R;
  ctx.fillRect((INC_W - POINTS_R), 0, POINTS_R, BALL_SIZE)
}

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

function isEndOfTheGame() {
  if (POINTS_R >= INC_W) {
    return true;
  } else if (POINTS_L >= INC_W) {
    return true;    
  }
    
  return false;
}

function prepareRestart() {
  if (!resarting) {
    resarting = true;
    seccondsLeft = RESTART_TIME;
    setTimeout(secondLess, 1000);
  }
}

function secondLess() {
  seccondsLeft -= 1;
  console.log(seccondsLeft);

  if(seccondsLeft > 0) {
    setTimeout(secondLess, 1000);
  } else {
    restart();
  }
}

function restart() {
  console.log('restarting');
  POINTS_L = Math.floor(INC_W / 2);
  POINTS_R = Math.floor(INC_W / 2);
  gameEnded = false;
  resarting = false;
}

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

function counterAddPoint(to) {
  if (to === 'left') {
    POINTS_L += 1;
    POINTS_R -= 1;
  } else {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92OS44LjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYW55cGl4ZWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW55cGl4ZWwvbGliL2FueXBpeGVsLmpzIiwibm9kZV9tb2R1bGVzL2FueXBpeGVsL2xpYi9jYW52YXMuanMiLCJub2RlX21vZHVsZXMvYW55cGl4ZWwvbGliL2NvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy9hbnlwaXhlbC9saWIvZXZlbnRzLmpzIiwic3JjL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvbGljZW5zZS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBsaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9hbnlwaXhlbCcpO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9saWNlbnNlLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIGxpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cy5jb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xubW9kdWxlLmV4cG9ydHMuY2FudmFzID0gcmVxdWlyZSgnLi9jYW52YXMnKTtcbm1vZHVsZS5leHBvcnRzLmV2ZW50cyA9IHJlcXVpcmUoJy4vZXZlbnRzJyk7XG5tb2R1bGUuZXhwb3J0cy5ldmVudHMuc2V0U3RhdGVMaXN0ZW5lck9uKGRvY3VtZW50KTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvbGljZW5zZS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBsaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XG52YXIgY2FudmFzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudmFyIGRvbUNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbmZpZy5jYW52YXNJZCk7XG5cbmRvbUNhbnZhcy53aWR0aCA9IGNvbmZpZy53aWR0aDtcbmRvbUNhbnZhcy5oZWlnaHQgPSBjb25maWcuaGVpZ2h0O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIDJEIGNhbnZhcyBjb250ZXh0XG4gKi9cbmNhbnZhcy5nZXRDb250ZXh0MkQgPSBmdW5jdGlvbiBnZXRDb250ZXh0MkQoKSB7XG5cdHJldHVybiBkb21DYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSAzRCBjYW52YXMgY29udGV4dFxuICovXG5jYW52YXMuZ2V0Q29udGV4dDNEID0gZnVuY3Rpb24gZ2V0Q29udGV4dDNEKCkge1xuXHRyZXR1cm4gZG9tQ2FudmFzLmdldENvbnRleHQoJ3dlYmdsJywge3ByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZX0pO1xufSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvbGljZW5zZS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBsaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBFeHBvc2Ugc29tZSBjb25maWd1cmF0aW9uIGRhdGEuIFRoZSB1c2VyIGNhbiBvdmVyd3JpdGUgdGhpcyBpZiB0aGVpciBzZXR1cCBpcyBkaWZmZXJlbnQuXG4gKi9cbnZhciBjb25maWcgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5jb25maWcuY2FudmFzSWQgPSAnYnV0dG9uLWNhbnZhcyc7XG5jb25maWcud2lkdGggPSAxNDA7XG5jb25maWcuaGVpZ2h0ID0gNDI7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9saWNlbnNlLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIGxpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIExpc3RlbiBmb3IgdGhlICdidXR0b25TdGF0ZXMnIGV2ZW50IGZyb20gYSBET00gdGFyZ2V0IGFuZCBlbWl0IG9uQnV0dG9uRG93biAvIFVwIGV2ZW50c1xuICogZGVwZW5kaW5nIG9uIHRoZSByZXBvcnRlZCBidXR0b24gc3RhdGVcbiAqL1xudmFyIGV2ZW50cyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmV2ZW50cy5zZXRTdGF0ZUxpc3RlbmVyT24gPSBmdW5jdGlvbiBzZXRTdGF0ZUxpc3RlbmVyT24odGFyZ2V0KSB7XG5cdFx0XG5cdGlmICh0YXJnZXQuYW55cGl4ZWxMaXN0ZW5lcikge1xuXHRcdHJldHVybjtcblx0fVxuXHRcblx0dGFyZ2V0LmFueXBpeGVsTGlzdGVuZXIgPSB0cnVlO1xuXG5cdHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdidXR0b25TdGF0ZXMnLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0ZGF0YS5kZXRhaWwuZm9yRWFjaChmdW5jdGlvbihidXR0b24pIHtcblx0XHRcdHZhciB4ID0gYnV0dG9uLnAueDtcblx0XHRcdHZhciB5ID0gYnV0dG9uLnAueTtcblx0XHRcdHZhciBzdGF0ZSA9IGJ1dHRvbi5zO1xuXHRcdFx0dmFyIGV2ZW50ID0gc3RhdGUgPT09IDEgPyAnb25CdXR0b25Eb3duJyA6ICdvbkJ1dHRvblVwJztcblx0XHRcdHZhciBrZXkgPSB4ICsgJzonICsgeTtcblxuXHRcdFx0aWYgKHN0YXRlID09PSAxKSB7XG5cdFx0XHRcdGV2ZW50cy5wdXNoZWRCdXR0b25zW2tleV0gPSB7eDogeCwgeTogeX07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkZWxldGUgZXZlbnRzLnB1c2hlZEJ1dHRvbnNba2V5XTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50LCB7ZGV0YWlsOiB7eDogeCwgeTogeX19KSk7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG4vKipcbiAqIEEgbWFwIG9mIGN1cnJlbnRseS1wdXNoZWQgYnV0dG9ucywgcHJvdmlkZWQgZm9yIHV0aWxpdHlcbiAqL1xuZXZlbnRzLnB1c2hlZEJ1dHRvbnMgPSB7fTtcbiIsIi8qXG5cblFVRSBRVUVEQTogXG4gLSBSZWluY2lhciBlbCBqdWVnbyBjdWFuZG8gYWNhYmUgKGVuIHZhcmlvcyBzZWd1bmRvcywgaWRlYWxtZW50ZSBtb3N0cmFuZG8gdW4gY29udGFkb3IpXG4gLSBBZGFwdGFybG8gYSBsYSBwYW50YWxsYSBkZSBMb25kcmVzIFRfVFxuXG4qL1xuXG52YXIgYW55cGl4ZWwgPSByZXF1aXJlKCdhbnlwaXhlbCcpOyBcbnZhciBjdHggPSBhbnlwaXhlbC5jYW52YXMuZ2V0Q29udGV4dDJEKCk7XG5cbi8vIFNldCBoZWlnaHQgYW5kIHdpZHRoIHZhcmlhYmxlc1xudmFyIElOQ19XID0gYW55cGl4ZWwuY29uZmlnLndpZHRoO1xudmFyIElOQ19IID0gYW55cGl4ZWwuY29uZmlnLmhlaWdodDtcblxubGV0IGludGVydmFsID0gbnVsbDtcbmNvbnN0IElOVEVSVkFMX1RJTUUgPSAxMDtcblxuY29uc3QgUkVTVEFSVF9USU1FID0gNTtcblxuY29uc3QgQkFMTF9TSVpFID0gNTtcblxuY29uc3QgQ09MT1JfTCA9ICcjRjAwJztcbmNvbnN0IENPTE9SX1IgPSAnIzAwRic7XG5cbmxldCBQT0lOVFNfTCA9IE1hdGguZmxvb3IoSU5DX1cgLyAyKTtcbmxldCBQT0lOVFNfUiA9IE1hdGguZmxvb3IoSU5DX1cgLyAyKTtcblxuY29uc3QgZWxlbUwgPSBbXTtcbmNvbnN0IGVsZW1SID0gW107XG5cbmxldCBnYW1lRW5kZWQgPSB0cnVlO1xubGV0IHJlc2FydGluZyA9IGZhbHNlO1xubGV0IHNlY2NvbmRzTGVmdCA9IDA7XG5cbi8qKlxuICogT24gbG9hZCwgZHJhdyBhIHNxdWFyZVxuICovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgc3RhcnQpO1xuXG4vKipcbiAqIE9uIGJ1dHRvbiBkb3duLCBjbGVhciB0aGUgd2FsbFxuICovXG4vLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdvbkJ1dHRvbkRvd24nLCBmdW5jdGlvbihldmVudCkge31cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignb25CdXR0b25VcCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGlmIChldmVudC5kZXRhaWwueCA8IElOQ19XIC8gMikge1xuICAgIGFkZEJhbGwoZWxlbUwsIENPTE9SX0wsIGV2ZW50LmRldGFpbCk7XG4gIH0gZWxzZSB7XG4gICAgYWRkQmFsbChlbGVtUiwgQ09MT1JfUiwgZXZlbnQuZGV0YWlsKTtcbiAgfVxufSk7XG5cblxuLyoqXG4gKiBJbml0IGdhbWUgYW5kIGludGVydmFsXG4gKi9cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuXHRjbGVhcigpO1xuICBnYW1lRW5kZWQgPSBmYWxzZTtcbiAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChydW4sIElOVEVSVkFMX1RJTUUpO1xufVxuXG4vKipcbiAqIEV4ZWN1dGUgZWFjaCBnYW1lIGZyYW1lIF5eXG4gKi9cbmZ1bmN0aW9uIHJ1biAoKSB7XG4gIGNhbGN1bGF0ZSgpO1xuICBjbGVhcigpO1xuICBkcmF3KCk7XG5cbiAgaWYgKGlzRW5kT2ZUaGVHYW1lKCkpIHtcbiAgICBnYW1lRW5kZWQgPSB0cnVlO1xuICAgIHByZXBhcmVSZXN0YXJ0KCk7XG4gIH1cbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIG5ldyBwb3NpdGlvbiBmb3IgZXZlcnkgaXRlbSBpbiBzY3JlZW5cbiAqL1xuZnVuY3Rpb24gY2FsY3VsYXRlKCkge1xuICAvLyBSZXBvc2l0aW9uIExcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtTC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGwgPSBlbGVtTFtpXTtcbiAgICBpZihsLnggPT09IElOQ19XICsgQkFMTF9TSVpFKSB7XG4gICAgICAvLyBJZiBib3VuZGVkLCByZW1vdmUgZWxlbWVudFxuICAgICAgZWxlbUwuc3BsaWNlKGksIDEpO1xuXG4gICAgICAvLyBBbmQgdXBkYXRlIGNvdW50ZXJzXG4gICAgICBjb3VudGVyQWRkUG9pbnQoJ2xlZnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbC54ICs9IDE7XG4gICAgfVxuICB9XG5cbiAgLy8gUmVwb3NpdGlvbiBSXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbVIubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByID0gZWxlbVJbaV07XG4gICAgaWYoci54ID09PSAtQkFMTF9TSVpFKSB7XG4gICAgICAvLyBJZiBib3VuZGVkLCByZW1vdmUgZWxlbWVudFxuICAgICAgZWxlbVIuc3BsaWNlKGksIDEpO1xuXG4gICAgICAvLyBBbmQgdXBkYXRlIGNvdW50ZXJzXG4gICAgICBjb3VudGVyQWRkUG9pbnQoJ3JpZ2h0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHIueCAtPSAxO1xuICAgIH1cbiAgfVxuXG4gIC8vIENhbGN1bGF0ZSBjb2xsaXNpb25zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbUwubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBsID0gZWxlbUxbaV07XG5cbiAgICAvLyBCZXR3ZWVuIGJhbGxzXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBlbGVtUi5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgciA9IGVsZW1SW2pdXG4gICAgICBpZiAobC54ICsgQkFMTF9TSVpFID49IHIueCAgXG4gICAgICAmJiBsLnkgLSByLnkgPiAtNVxuICAgICAgJiYgbC55IC0gci55ID4gLTUpe1xuICAgICAgICBlbGVtTC5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGVsZW1SLnNwbGljZShqLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGRyYXcoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbUwubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBlID0gZWxlbUxbaV07XG5cbiAgICBjdHguZmlsbFN0eWxlID0gZS5jb2xvcjtcbiAgICBjdHguZmlsbFJlY3QoZS54LCBlLnksIEJBTExfU0laRSwgQkFMTF9TSVpFKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbVIubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBlID0gZWxlbVJbaV07XG5cbiAgICBjdHguZmlsbFN0eWxlID0gZS5jb2xvcjtcbiAgICBjdHguZmlsbFJlY3QoZS54LCBlLnksIEJBTExfU0laRSwgQkFMTF9TSVpFKVxuICB9XG5cbiAgZHJhd1BvaW50cygpO1xuXG4gIGlmIChnYW1lRW5kZWQgPT09IHRydWUpIHtcbiAgICBjb25zb2xlLmxvZygnR2FtZSBPdmVyJyk7XG4gICAgZHJhd0dhbWVPdmVyKCk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZHJhd1BvaW50cygpIHtcbiAgY3R4LmZpbGxTdHlsZSA9IENPTE9SX0w7XG4gIGN0eC5maWxsUmVjdCgwLCAwLCBQT0lOVFNfTCwgQkFMTF9TSVpFKVxuXG4gIGN0eC5maWxsU3R5bGUgPSBDT0xPUl9SO1xuICBjdHguZmlsbFJlY3QoKElOQ19XIC0gUE9JTlRTX1IpLCAwLCBQT0lOVFNfUiwgQkFMTF9TSVpFKVxufVxuXG5mdW5jdGlvbiBkcmF3R2FtZU92ZXIoKSB7XG4gIGlmIChQT0lOVFNfTCA+IFBPSU5UU19SKSB7XG4gICAgY3R4LmZpbGxTdHlsZSA9IENPTE9SX0w7XG4gIH0gZWxzZSB7XG4gICAgY3R4LmZpbGxTdHlsZSA9IENPTE9SX1I7XG4gIH1cbiAgY3R4LmZvbnQgPSBcIjQycHhcIjtcbiAgY3R4LmZpbGxUZXh0KCdHQU1FIE9WRVInLCA0MCwgMjApO1xuXG4gIGN0eC5maWxsVGV4dChzZWNjb25kc0xlZnQsIElOQ19XIC8gMiAtIDIsIDMwKTtcblxufVxuXG5mdW5jdGlvbiBpc0VuZE9mVGhlR2FtZSgpIHtcbiAgaWYgKFBPSU5UU19SID49IElOQ19XKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoUE9JTlRTX0wgPj0gSU5DX1cpIHtcbiAgICByZXR1cm4gdHJ1ZTsgICAgXG4gIH1cbiAgICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlUmVzdGFydCgpIHtcbiAgaWYgKCFyZXNhcnRpbmcpIHtcbiAgICByZXNhcnRpbmcgPSB0cnVlO1xuICAgIHNlY2NvbmRzTGVmdCA9IFJFU1RBUlRfVElNRTtcbiAgICBzZXRUaW1lb3V0KHNlY29uZExlc3MsIDEwMDApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNlY29uZExlc3MoKSB7XG4gIHNlY2NvbmRzTGVmdCAtPSAxO1xuICBjb25zb2xlLmxvZyhzZWNjb25kc0xlZnQpO1xuXG4gIGlmKHNlY2NvbmRzTGVmdCA+IDApIHtcbiAgICBzZXRUaW1lb3V0KHNlY29uZExlc3MsIDEwMDApO1xuICB9IGVsc2Uge1xuICAgIHJlc3RhcnQoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZXN0YXJ0KCkge1xuICBjb25zb2xlLmxvZygncmVzdGFydGluZycpO1xuICBQT0lOVFNfTCA9IE1hdGguZmxvb3IoSU5DX1cgLyAyKTtcbiAgUE9JTlRTX1IgPSBNYXRoLmZsb29yKElOQ19XIC8gMik7XG4gIGdhbWVFbmRlZCA9IGZhbHNlO1xuICByZXNhcnRpbmcgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gYWRkQmFsbChsaXN0LCBjb2xvciwgcG9zaXRpb24pIHtcbiAgaWYgKGdhbWVFbmRlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGxldCB4ID0gcG9zaXRpb24ueCAtIDI7XG4gIGxldCB5ID0gcG9zaXRpb24ueSAtIDI7XG5cbiAgbGlzdC5wdXNoKHtcbiAgICBjb2xvcixcbiAgICB4LFxuICAgIHksXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjb3VudGVyQWRkUG9pbnQodG8pIHtcbiAgaWYgKHRvID09PSAnbGVmdCcpIHtcbiAgICBQT0lOVFNfTCArPSAxO1xuICAgIFBPSU5UU19SIC09IDE7XG4gIH0gZWxzZSB7XG4gICAgUE9JTlRTX1IgKz0gMTtcbiAgICBQT0lOVFNfTCAtPSAxO1xuICB9XG59XG5cbi8qKlxuICogQ2xlYXIgc2NyZWVuXG4gKi9cbmZ1bmN0aW9uIGNsZWFyKCkge1xuICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICBjdHguZmlsbFJlY3QoMCwgMCwgSU5DX1csIElOQ19IKVxufVxuIl19
