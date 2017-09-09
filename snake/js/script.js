const GAME_CLASSES = [
  'snake-unit',
  'food-unit',
  'barrier-unit',
  'snake-unit-tail',
  'snake-unit-head',
  'snake-unit-direction-right',
  'snake-unit-direction-left',
  'snake-unit-direction-down',
  'snake-unit-direction-up',
  'snake-unit-turn-right',
  'snake-unit-turn-left'
  ];
const FIELD_SIZE_X = 20;
const FIELD_SIZE_Y = 20;
const SNAKE_SPEED = 300;
const BARRIER_NUM = 5;
const BARRIER_FREQUENCY = 3000;
var gameStarted = false;
var snake;
var snake_timer;
var barriers;
var barrier_timer;
var score;
var foodExists;
var food = {
  x: -1,
  y: -1,
};

/********************************* базовый конструктор абстрактного модуля ********************************************/

const makeUnit = function(coordX, coordY) {
    this.x = coordX;
    this.y = coordY;
    this.classes = [];
    this.unit = document.getElementsByClassName("cell-" + this.x + "-" + this.y)[0];
}
// вынесли методы в прототип чтобы они не генерировались в каждом созданном объекте
makeUnit.prototype.draw = function() {
   for (var item in this.classes){
        this.unit.classList.add(this.classes[item]);
    }
}

makeUnit.prototype.erase = function() {
   for (var item in this.classes){
        this.unit.classList.remove(this.classes[item]);
    }
}

makeUnit.prototype.isIt = function(coordX, coordY) {
  if (this.x === coordX && this.y === coordY) return true;
      return false;
}

/***************************************** конструктор модуля змейки**************************************************/

const makeSnakeUnit = function(coordX, coordY, setDirection) {
    makeUnit.call(this, coordX, coordY); // вызов родительского конструктора для данного объекта с прараметрами
    this.direction = setDirection;
    this.classes[0] = 'snake-unit';
}

// задаем наследование,
makeSnakeUnit.prototype = Object.create(makeUnit.prototype); // теперь объект-прототип = объекту абстрактного модуля
makeSnakeUnit.prototype.constructor = makeSnakeUnit; //иначе это свойство будет ссылаться на makeUnit

makeSnakeUnit.prototype.setNDrawHead = function() {
  this.classes.push('snake-unit-head');
  this.classes.push('snake-unit-direction-' + this.direction);
  this.draw();
}

makeSnakeUnit.prototype.unSetHead = function() {
  for (var i = this.classes.length - 1; i >= 0; i-- ) {
    if ((this.classes[i] == 'snake-unit-head') || (~this.classes[i].indexOf('snake-unit-direction'))) {
      this.unit.classList.remove(this.classes[i]);
      this.classes.splice(i, 1);
    }        
  }     
}

makeSnakeUnit.prototype.setNDrawTail = function() {
  this.unSetRounding();
  this.classes.push('snake-unit-tail');
  this.classes.push('snake-unit-direction-' + this.direction);
  this.draw();
}

makeSnakeUnit.prototype.setNDrawRounding = function(nextUnitDirection) {
  if (this.direction != nextUnitDirection){
    if ((this.direction == 'up' && nextUnitDirection == 'left') ||
        (this.direction == 'right' && nextUnitDirection == 'up') ||
        (this.direction == 'down' && nextUnitDirection == 'right') ||
        (this.direction == 'left' && nextUnitDirection == 'down')) {
          this.classes.push('snake-unit-turn-left');
    } else if (
        (this.direction == 'up' && nextUnitDirection == 'right') ||
        (this.direction == 'right' && nextUnitDirection == 'down') ||
        (this.direction == 'down' && nextUnitDirection == 'left') ||
        (this.direction == 'left' && nextUnitDirection == 'up')) {
          this.classes.push('snake-unit-turn-right');
    }
    this.classes.push('snake-unit-direction-' + this.direction);
    this.draw();
  }
}

makeSnakeUnit.prototype.unSetRounding = function() {
  for (var i = this.classes.length - 1; i >= 0; i-- ) {
    if ((~this.classes[i].indexOf('snake-unit-turn')) || (~this.classes[i].indexOf('snake-unit-direction'))) {
      this.unit.classList.remove(this.classes[i]);
      this.classes.splice(i, 1);
    }        
  }
}

/***************************************** конструктор модуля еды ****************************************************/

const makeFoodUnit = function(coordX, coordY) {
  makeUnit.call(this, coordX, coordY);
  this.classes[0] = 'food-unit';  
}

makeFoodUnit.prototype = Object.create(makeUnit.prototype);
makeFoodUnit.prototype.constructor = makeFoodUnit;

/***************************************** конструктор модуля препятствий ********************************************/

const makeBarrierUnit = function(coordX, coordY) {
  makeUnit.call(this, coordX, coordY);
  this.classes[0] = 'barrier-unit'; 
}
makeBarrierUnit.prototype = Object.create(makeUnit.prototype);
makeBarrierUnit.prototype.constructor = makeBarrierUnit;

/***************************************** конструктор собственно змейки *********************************************/
const makeSnake = function() {
  this.direction = 'up';
  this.x = Math.floor(FIELD_SIZE_X / 2);
  this.y = Math.floor(FIELD_SIZE_Y / 2);
  var snake_head = new makeSnakeUnit(this.x, this.y, this.direction);
  snake_head.setNDrawHead();
  var snake_tail = new makeSnakeUnit(this.x + 1, this.y, this.direction);
  snake_tail.setNDrawTail();
  this.push(snake_tail);
  this.push(snake_head);
}

//Наследуем от массива
makeSnake.prototype = Object.create(Array.prototype);
makeSnake.prototype.constructor = makeSnake;

makeSnake.prototype.isIt = function(coordX, coordY) {
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i].isIt(coordX, coordY)) return true;
  }
    return false;
  }

makeSnake.prototype.move = function() {
  var fixDirection = this.direction;
  switch (fixDirection) {
    case 'up':
      this.x--;
      if (this.x < 0) {
        this.x += FIELD_SIZE_X;
      }
      break;
    case 'down':
      this.x++;
      if (this.x >= FIELD_SIZE_X) {
        this.x -= FIELD_SIZE_X;
      }
      break;
    case 'left':
      this.y--;
      if (this.y < 0) {
        this.y += FIELD_SIZE_Y;
      }
      break;
    case 'right':
      this.y++;
      if (this.y >= FIELD_SIZE_Y) {
        this.y -= FIELD_SIZE_Y;
      }
  }

  if (!this.isIt(this.x, this.y) && !isBarrierXY(this.x, this.y)) {
    var new_unit = new makeSnakeUnit(this.x, this.y, fixDirection);
    new_unit.setNDrawHead();
    this[this.length - 1].unSetHead();
    this[this.length - 1].setNDrawRounding(new_unit.direction);
     this.push(new_unit); 
    
    if (!ateFood(new_unit)) {
      var tail_remove = this.splice(0, 1)[0];
      tail_remove.erase();
      this[0].direction = this[1].direction;
      this[0].setNDrawTail();
    }    

  } else { 
  document.getElementById("snake-field").classList.add("show-alert"); 
    finishGame();
  }  
} 

/***************************************** конструктор набора барьеров *********************************************/
// const makeBarrier = function() {
  
// }

// //Наследуем от массива
// makeBarrier.prototype = Object.create(Array.prototype);
// makeBarrier.prototype.constructor = makeBarrier;

// makeSnake.prototype.isIt = function(coordX, coordY) {
//   for (var i = this.length - 1; i >= 0; i--) {
//     if (this[i].isIt(coordX, coordY)) return true;
//   }
//     return false;
// }

/***************************************** Функции самой игры *********************************************/

function prepareGameField() {
  var gameField = document.createElement("div");
  gameField.setAttribute("class", "game-field");
  for (var i = 0; i < FIELD_SIZE_X; i++) {
    var row = document.createElement("div");
    row.setAttribute("class", "game-field-row row-" + i);
    for (var j = 0; j < FIELD_SIZE_Y; j++) {
      var cell = document.createElement("div");
      cell.setAttribute("class", "game-field-cell cell-" + i + '-' + j);
      row.appendChild(cell);
    }
    gameField.appendChild(row);
  }
   document.getElementById("snake-field").appendChild(gameField);   
}

function startGame() {
  if (!gameStarted) {
    // для реализации перезапуска: задаем начальные/сбрасываем значения
    barriers = [];  
    score = 0;
    //очистка классов ячеек (необходимо в случае перезапуска)
    flushCellClasses();
    document.getElementById("snake-field").classList.remove("show-alert");
    snake = new makeSnake();
    document.getElementById("score-indic").innerHTML = score; // score = 0
    document.getElementById("btn-start-stop").classList.toggle('btn-stop');
    gameStarted = true;
    //snake.move.bind(snake) - если без bind будет вызываться в глобальном контексте
    snake_timer = setInterval(snake.move.bind(snake), SNAKE_SPEED);
    barrier_timer = setInterval(createBarrier, 3000);
    setTimeout(createFood, 5000);

  } else {
    finishGame();
  }
}

function finishGame() {
  gameStarted = false;
  clearInterval(snake_timer);
  clearInterval(barrier_timer);  
  document.getElementById("btn-start-stop").classList.toggle('btn-stop');
}

function isSnakeXY(_x, _y) {
  var result = false;
  for (var i = 0; i < snake.length; i++) {
    if (_x === snake[i].x && _y === snake[i].y) {
      result = true;
      break;
    }
  }
  return result;
}

function isBarrierXY(_x, _y) {
  var result = false;
  for (var i = 0; i < barriers.length; i++) {
    if (_x === barriers[i].x && _y === barriers[i].y) {
      result = true;
      break;
    }
  }
  return result;
}

function changeDirection(e) {
  switch (e.keyCode) {
    case 37:
      snake.direction = "left";
      break;
    case 38:
      snake.direction = "up";
      break;
    case 39:
      snake.direction = "right";
      break;
    case 40:
      snake.direction = "down";
      break;
  }
}

function changeDirection2() {
  switch (this.getAttribute('id')) {
    case 'btn-left':
      snake.direction = 'left';
      break;
    case 'btn-up':
      snake.direction = 'up';
      break;
    case 'btn-right':
      snake.direction = 'right';
      break;
    case 'btn-down':
      snake.direction = 'down';
      break;
  }
}

function createFood() {
  var foodCreated = false;
  var food_x, food_y;
  while (!foodCreated) {
    food_x = Math.floor(Math.random() * FIELD_SIZE_X);
    food_y = Math.floor(Math.random() * FIELD_SIZE_Y);
    if (!isSnakeXY(food_x, food_y) && !isBarrierXY(food_x, food_y)) {
      if (!foodExists) {
        food = new makeFoodUnit(food_x, food_y);
        food.draw();
        foodExists = true;
      }
      foodCreated = true;
    }
  }
}

function ateFood(unit) {
  var check = false;
  if (unit.x === food.x && unit.y === food.y) {
    check = true;
    foodExists = false;
    food.erase();
    createFood();
    document.getElementById("score-indic").innerHTML = ++score;
  }
  return check;
}

function createBarrier() {
  var barrierCreated = false;
  var barrier_x, barrier_y, barrier;
  if (barriers.length >= BARRIER_NUM) {
    barriers[0].erase();
    barriers.shift();
  }
  while (!barrierCreated) {
    barrier_x = Math.floor(Math.random() * FIELD_SIZE_X);
    barrier_y = Math.floor(Math.random() * FIELD_SIZE_Y);
    if (!isSnakeXY(barrier_x, barrier_y) && !(barrier_x === food.x && barrier_y === food.y)) {
      barrier = new makeBarrierUnit(barrier_x, barrier_y);
      barrier.draw();
      barriers.push(barrier);
      barrierCreated = true;
    }
  }

}

function flushCellClasses() {
  var cells = document.getElementsByClassName("game-field-cell");
  for (var i = 0; i < cells.length; i++) {
    for (var key in GAME_CLASSES) {
      cells[i].classList.remove(GAME_CLASSES[key]);
    }    
  }
  // для устранения ошибок с созданием 2 экземпляров еды
  foodExists = false;
}

window.onload = function() {
  prepareGameField();
  window.addEventListener("keydown", changeDirection);
  // STD forEach <= getElementsByClassName-COLLECTION 
  // for setting EventListenet fo each element of COLLECTION
  [].forEach.call(document.getElementsByClassName("control-btn"), function(item, i, arr){
      item.addEventListener("click", changeDirection2);
  });   
  document.getElementById("btn-start-stop").addEventListener("click", startGame);  
}
