let backgrounds = ['road', 'road', 'water', 'water', 'traintrack', 'bike', 'walkroad'];
let images = {};
let carLeft = {};
let carRight = {};
let character = {};

let carsLeft = [];
let carsRight = [];
let trains = [];
let waterIndices = [];
let bridgeColumns = [];
let walkroadObstacles = [];
let waterLeafPositions = [];
let waterPositions = [];
let coins = [];

let firstRoadIndex;
let secondRoadIndex;
let trainTrackIndex;
let player;

let timeSinceLastTrain = 0;
let timeSinceLastCarLeft = 0;
let timeSinceLastCarRight = 0;
let lastPosition = null;
let timeAtPosition = 0;
let totalTime = 0;

let timeLeft = 60;
let coinsCollected = 0;

const SAFE_DISTANCE = 10;
let gameOver = false;

function preload() {
  //load background images
  images['road'] = loadImage('img/background/road.png');
  images['water'] = loadImage('img/background/water.png');
  images['traintrack'] = loadImage('img/background/traintrack.png');
  images['bike'] = loadImage('img/background/bikeroad.png');
  images['walkroad'] = loadImage('img/background/walkroad.png');
  images['roadtop'] = loadImage('img/background/roadtop.png');
  images['roaddown'] = loadImage('img/background/roaddown.png');

  images['train'] = loadImage('img/obstacles/train.png');
  images['bridge'] = loadImage('img/obstacles/bridge.png');
  images['waterleaf'] = loadImage('img/obstacles/waterleaf.png');
  images['tree'] = loadImage('img/obstacles/tree.png');
  images['bush'] = loadImage('img/obstacles/bush.png');

  images['coin'] = loadImage('img/coin.png');

  //load car images
  carLeft['ambulance'] = loadImage('img/roadleft/ambulance.png');
  carLeft['L1'] = loadImage('img/roadleft/L1.png');
  carLeft['L2'] = loadImage('img/roadleft/L2.png');
  carLeft['L3'] = loadImage('img/roadleft/L3.png');
  carLeft['L4'] = loadImage('img/roadleft/L4.png');
  carLeft['L5'] = loadImage('img/roadleft/L5.png');
  carLeft['L6'] = loadImage('img/roadleft/L6.png');
  carLeft['L7'] = loadImage('img/roadleft/L7.png');

  carRight['police'] = loadImage('img/roadright/police.png');
  carRight['Truck1'] = loadImage('img/roadright/Truck1.png');
  carRight['Truck2'] = loadImage('img/roadright/Truck2.png');
  carRight['R1'] = loadImage('img/roadright/R1.png');
  carRight['R2'] = loadImage('img/roadright/R2.png');
  carRight['R3'] = loadImage('img/roadright/R3.png');
  carRight['R4'] = loadImage('img/roadright/R4.png');
  carRight['R5'] = loadImage('img/roadright/R5.png');

  //load character images
  character['up'] = loadImage('img/character/up.png');
  character['down'] = loadImage('img/character/down.png');
  character['right'] = loadImage('img/character/right.png');
  character['left'] = loadImage('img/character/left.png');
}


function updateTimeLeft() {
  if (timeLeft > 0) {
    timeLeft--;
    select('#time-left').html('Timer ' + timeLeft);
  } else {
    // Handle game over scenario
    console.log('Game Over!');
    noLoop();
    document.getElementById('game-over').style.display = 'block';
  }
}

class Character {
  constructor(image, x, y) {
    this.image = image;
    this.x = x; //player's current x-coordinate
    this.y = y; //player's current y-coordinate
  }

  move(direction) {
    let image;
    let nextX = this.x;
    let nextY = this.y;
    switch (direction) {
      case 'up':
        nextY = max(0, this.y - 100);
        image = character['up'];
        break;
      case 'down':
        nextY = min(height - 100, this.y + 100);
        image = character['down'];
        break;
      case 'left':
        nextX = max(0, this.x - 100);
        image = character['left'];
        break;
      case 'right':
        nextX = min(width - 100, this.x + 100);
        image = character['right'];
        break;
    }

    for (let obstacle of walkroadObstacles) {
      if (obstacle.x === nextX && obstacle.y === nextY) {
        console.log('Blocked by a tree or bush!');
        return;
      }
    }
    //update position
    this.x = nextX;
    this.y = nextY;
    this.image = image;
  }
  draw() {
    image(this.image, this.x, this.y);
  }

  checkCollision(entity) {
    let characterLeft = this.x;
    let characterRight = this.x + this.image.width;
    let characterTop = this.y;
    let characterBottom = this.y + this.image.height;

    let entityLeft = entity.x;
    let entityRight = entity.x + entity.image.width;
    let entityTop = entity.y;
    let entityBottom = entity.y + entity.image.height;

    return !(characterLeft > entityRight || characterRight < entityLeft || characterTop > entityBottom || characterBottom < entityTop);
  }
}

