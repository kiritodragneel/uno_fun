function Slotmachine(reelsEl, triggerEl, resultEl, opts = {}) {
  this.reelsEl = reelsEl;
  this.triggerEl = triggerEl;
  this.resultEl = resultEl;

  // row to be used to calculate game result (zero indexed)
  this.resultRow = opts.resultsRow ||  1;
  // base amount of time each reel will spin
  this.baseTime =  opts.baseTime || 2000;
  // flag so we don't start a new game if current one isn't finished
  this.isSpinning = false;
  // keep track of our reels timers
  this.timers = [];
  // keep track of currently selected tile values
  this.selectedTiles = [];
  // speed of tile movement
  this.speed = opts.speed || 200;

  this.bindButton();
}

Slotmachine.prototype.bindButton = function() {
  let self = this;
  this.triggerEl.addEventListener('click', function() {
    if (!self.isSpinning) {
      self.newGame();
    }
  });
};

Slotmachine.prototype.spin = function(reel, reelNum) {
  // take the last tile (we do this dom selection separate because querySelectorAll isn't a live list)
  let lastTile = reel.querySelector('li:last-child');
  // put it at the beginning
  reel.prepend(lastTile);
  let tiles = reel.querySelectorAll('li');
  // keep track of our new selected value
  this.selectedTiles[reelNum] = tiles[this.resultRow].getAttribute('data-result');
};

Slotmachine.prototype.calculateWin = function() {
  let targetResult = this.selectedTiles[0];
  let currResult;

  // compare each successive reel's result to the first reel's result
  for (let i = 1; i < this.selectedTiles.length; i++) {
    currResult = this.selectedTiles[i];
  }
};

Slotmachine.prototype.newGame = function() {
  // reset result & values
  let rand;
  let timeToSpin = this.baseTime;
  let self = this;

  this.isSpinning = true;

  // Start spinning each reel
  this.reelsEl.forEach(function(reel, index) {
    let timer = setInterval(function() {
        self.spin(reel, index);
    }, self.speed);
    self.timers[index] = timer;
  });

  // Clear each timer to stop reels spinning
  for (let i = 0; i < this.timers.length; i++) {
    // random amount of time (0 to 1 second) in between each stop
    rand = Math.floor(Math.random()*1000);
    // total spin time is previous reels total time plus rand
    timeToSpin += rand;
    // stop each reel
    setTimeout(function(i) {
      clearInterval(self.timers[i]);
      // calculate result on last reel
      if (i === self.timers.length-1) {
        self.isSpinning = false;
      }
    }, timeToSpin, i);
  }
};

function init() {
  reelsEl = document.querySelectorAll('.slotmachine__reel');
  triggerEl = document.querySelector('.slotmachine__handle');
  resultEl = document.querySelector('.slotmachine__result');

  let caffeineSlots = new Slotmachine(reelsEl, triggerEl, resultEl);
}

document.addEventListener('DOMContentLoaded', init);
