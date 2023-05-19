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


function setup() {
  createCanvas(1000, 800);
  shuffle(backgrounds, true);

  if (!backgrounds.includes('walkroad')) {
    backgrounds[0] = 'walkroad';
  }
  backgrounds.push('walkroad');
  //console.log(backgrounds);
  let roadIndices = backgrounds.map((bg, index) => bg === 'road' ? index : -1).filter(index => index !== -1);
  firstRoadIndex = roadIndices[0];
  secondRoadIndex = roadIndices[1];




  for (let i = 0; i < 5; i++) {
    addCar();
  }

  // generate new car every 1-2 seconds
  timeSinceLastCarLeft = random(60, 120);
  timeSinceLastCarRight = random(60, 120);

  trainTrackIndex = backgrounds.indexOf('traintrack');
  timeSinceLastTrain = random(60, 120);


  //Drawing Bridge
  backgrounds.forEach((bg, index) => {
    if (bg === 'water') {
      waterIndices.push(index);
      bridgeColumns.push(Math.floor(Math.random() * 10));
    }
  });
  // If the two road of water are adjacent, draw the bridge at the same column for both rows
  if (waterIndices.length >= 2 && Math.abs(waterIndices[0] - waterIndices[1]) === 1) {
    let column = Math.floor(Math.random() * 10);
    bridgeColumns[0] = column;
    bridgeColumns[1] = column;
  }


  //Drawing Trees and Bushes
  backgrounds.forEach((bg, i) => {
    if (bg === 'walkroad') {
      let columns = [];
      while (columns.length < Math.round(random(2, 3))) {
        let column = Math.floor(Math.random() * 10);
        if (!columns.includes(column)) {
          columns.push(column);
        }
      }
      // Storing tree,bush position
      for (let j = 0; j < columns.length; j++) {
        let x = columns[j] * 100;
        let y = i * 100;
        let obstacleImage = Math.random() < 0.5 ? images['tree'] : images['bush'];
        walkroadObstacles.push({ image: obstacleImage, x: x, y: y });
      }
    }
  });

  //Drawing waterleaf
  backgrounds.forEach((bg, i) => {
    if (bg === 'water') {
      // Randomly draw waterleaf, making sure to not overlap with the bridges
      let columns = [];
      while (columns.length < Math.round(random(1, 2))) {
        let column = Math.floor(Math.random() * 10);
        if (!columns.includes(column) && !bridgeColumns.includes(column)) {
          columns.push(column);
        }
      }
      // Store the waterleaf position
      for (let j = 0; j < columns.length; j++) {
        let x = columns[j] * 100;
        let y = i * 100;
        waterLeafPositions.push({ image: images['waterleaf'], x: x, y: y });
      }
    }
  });

  backgrounds.forEach((bg, i) => {
    if (bg === 'water') {
      for (let j = 0; j < 10; j++) {
        if (!bridgeColumns.includes(j)) {
          waterPositions.push({ image: images['water'], x: j * 100, y: i * 100 });
        }
      }
    }
  });

  // Drawing Character
  let bikeroadIndex = backgrounds.indexOf('bike');
  let randomColumn = Math.floor(Math.random() * 10);
  player = new Character(character['down'], randomColumn * 100, bikeroadIndex * 100);


  //Finding position to draw Coins 
  for (let i = 0; i < 10; i++) {
    let validPosition = false;
    while (!validPosition) {
      let randomX = Math.floor(Math.random() * width);
      let randomY = Math.floor(Math.random() * height);

      randomX = Math.floor(randomX / 100) * 100;
      randomY = Math.floor(randomY / 100) * 100;

      let isOnObstacle = false;
      for (let obstacle of walkroadObstacles) {
        if (obstacle.x === randomX && obstacle.y === randomY) {
          isOnObstacle = true;
          break;
        }
      }

      let isOnWater = false;
      for (let water of waterPositions) {
        if (water.x === randomX && water.y === randomY) {
          isOnWater = true;
          break;
        }
      }

      let isNearOtherCoin = false;
      for (let coin of coins) {
        if (Math.abs(coin.x - randomX) < 100 && Math.abs(coin.y - randomY) < 100) {
          isNearOtherCoin = true;
          break;
        }
      }

      let isOnCoin = false;
      for (let coin of coins) {
        if (coin.x === randomX && coin.y === randomY) {
          isOnCoin = true;
          break;
        }
      }

      let isOnWaterTile = backgrounds[Math.floor(randomY / 100)] === 'water';

      if (!isOnObstacle && !isOnCoin && !isOnWater && !isNearOtherCoin && !isOnWaterTile) {
        validPosition = true;
        coins.push(new Coin(images['coin'], randomX, randomY));
      }
    }
  }

  setInterval(updateTimeLeft, 1000);
}


function draw() {

  for (let i = 0; i < backgrounds.length; i++) {
    if (backgrounds[i] === 'road' && backgrounds[i + 1] === 'road') {
      // If two road.png is adjacent, replace with 'roadtop' and 'roaddown'
      for (let j = 0; j < 10; j++) {
        image(images['roadtop'], j * 100, i * 100);
        image(images['roaddown'], j * 100, (i + 1) * 100);
      }
      i++;
    } else {
      // Draw other backgrounds
      for (let j = 0; j < 10; j++) {
        let waterIndex = waterIndices.indexOf(i);
        if (waterIndex !== -1 && j === bridgeColumns[waterIndex]) {
          // Draw bridge
          image(images['bridge'], j * 100, i * 100);
        } else {
          image(images[backgrounds[i]], j * 100, i * 100);
        }
      }
    }
  }

  // Draw the trees,bushes
  for (let obstacle of walkroadObstacles) {
    image(obstacle.image, obstacle.x, obstacle.y);
  }

  for (let waterleaf of waterLeafPositions) {
    image(waterleaf.image, waterleaf.x, waterleaf.y);
  }

  // for the first row of road, draw cars going to left
  for (let i = carsLeft.length - 1; i >= 0; i--) {
    let car = carsLeft[i];
    car.move(carsLeft);
    if (car.isOffScreen()) {
      carsLeft.splice(i, 1);
      addCar('left');
    } else {
      image(car.image, car.x, firstRoadIndex * 100 + 50 - car.image.height / 2);
    }
  }

  //  for the second row of road, draw cars going to right
  for (let i = carsRight.length - 1; i >= 0; i--) {
    let car = carsRight[i];
    car.move(carsRight);
    if (car.isOffScreen()) {
      carsRight.splice(i, 1);
      addCar('right');
    } else {
      image(car.image, car.x, secondRoadIndex * 100 + 50 - car.image.height / 2);
    }
  }

  // Update timers
  timeSinceLastCarLeft--;
  timeSinceLastCarRight--;

  // Check time to add a new car
  if (timeSinceLastCarLeft <= 0) {
    addCar('left');
    timeSinceLastCarLeft = random(120, 240);
  }
  if (timeSinceLastCarRight <= 0) {
    addCar('right');
    timeSinceLastCarRight = random(120, 240);
  }

  //draw train
  for (let i = trains.length - 1; i >= 0; i--) {
    let train = trains[i];
    train.move(trains);
    if (train.isOffScreen()) {
      trains.splice(i, 1);
      addTrain();
    } else {
      image(train.image, train.x, trainTrackIndex * 100 + 50 - train.image.height / 2);
    }
  }

  timeSinceLastTrain--;

  // Check time to add a new train
  if (timeSinceLastTrain <= 0) {
    addTrain();
    timeSinceLastTrain = random(100000, 200000);
  }


  player.draw();


  let playerYIndex = Math.floor(player.y / 100);
  let playerBackground = backgrounds[playerYIndex];

  // check car collisions only when the player is on the 'road' background
  if (playerBackground === 'road') {
    for (let car of carsLeft) {
      if (player.y === firstRoadIndex * 100 && player.checkCollision(car)) {
        console.log('Game Over! Collision with car on left lane');
        gameOver = true;
        noLoop();
        document.getElementById('game-over').style.display = 'block';
      }
    }

    for (let car of carsRight) {
      if (player.y === secondRoadIndex * 100 && player.checkCollision(car)) {
        console.log('Game Over! Collision with car on right lane');
        gameOver = true;
        noLoop();
        document.getElementById('game-over').style.display = 'block';
      }
    }
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


function addCar(direction) {
  let carImage;
  if (direction === 'left') {
    carImage = carLeft[Object.keys(carLeft)[Math.floor(Math.random() * Object.keys(carLeft).length)]];
    // check space for new car and safe distance
    if (carsLeft.length === 0 || (width - carsLeft[carsLeft.length - 1].x) > carImage.width + SAFE_DISTANCE) {
      carsLeft.push(new Car(carImage, 'left', random(0.1, 1)));  // Random speed 1~5
    }
  } else {
    carImage = carRight[Object.keys(carRight)[Math.floor(Math.random() * Object.keys(carRight).length)]];
    if (carsRight.length === 0 || carsRight[carsRight.length - 1].x > carImage.width + SAFE_DISTANCE) {
      carsRight.push(new Car(carImage, 'right', random(0.1, 1)));
    }
  }
}

//Car
class Car {
  constructor(image, direction, speed = 2) {
    this.image = image;
    this.direction = direction;
    this.speed = speed;
    if (this.direction === 'left') {
      this.x = width;
    } else {
      this.x = -this.image.width;
    }
  }

  move(cars) {
    if (this.direction === 'left') {
      this.x -= this.speed;
    } else {
      this.x += this.speed;
    }
    this.checkDistance(cars);
  }


  checkDistance(cars) {
    let nextCar;
    if (this.direction === 'left') {
      nextCar = cars.find(car => car.x < this.x);
    } else {
      nextCar = cars.find(car => car.x > this.x);
    }

    if (nextCar && abs(nextCar.x - this.x) < SAFE_DISTANCE) {
      this.speed = max(0, this.speed - 0.5);  // Slow down by 0.5, but not 0
    } else if (this.speed < 5) {  //  speed is less than 5, speed up, if there is no car
      this.speed += 0.5;
    }
  }

  isOffScreen() {
    if (this.direction === 'left') {
      return this.x < -this.image.width;
    } else {
      return this.x > width;
    }
  }
}

//Train
class Train {
  constructor(image, direction, speed = 2) {
    this.image = image;
    this.direction = direction;
    this.speed = speed;
    if (this.direction === 'right') {
      this.x = -this.image.width;
    }
  }

  move() {
    this.x += this.speed;
    //console.log("Train speed: " + this.speed);
  }

  isOffScreen() {
    if (this.direction === 'right') {
      return this.x > width;
    } else {
      return this.x < -this.image.width;
    }
  }
}

function addTrain() {
  let trainImage = images['train'];
  let direction = 'right';

  let train = new Train(trainImage, direction, random(1, 20));
  trains.push(train);
}

//Coin
class Coin {
  constructor(image, x, y) {
    this.image = image;
    this.x = x;
    this.y = y;
  }

  draw() {
    image(this.image, this.x, this.y);
  }
}

//Moving Player
function keyPressed() {
  switch (keyCode) {
    case UP_ARROW:
      player.move('up');
      break;
    case DOWN_ARROW:
      player.move('down');
      break;
    case LEFT_ARROW:
      player.move('left');
      break;
    case RIGHT_ARROW:
      player.move('right');
      break;
  }

  //Restart game
  if (key === ' ') {
    location.reload();
  }
}
