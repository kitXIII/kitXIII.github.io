var GAME_CLASSES = [
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
var FIELD_SIZE_X = 20;
var FIELD_SIZE_Y = 20;
var SNAKE_SPEED = 300;
var BARRIER_NUM = 5;
var gameStarted = false;
var snake;
var direction;
var snake_timer;
var score;
var foodExists;
var food = {
  x: -1,
  y: -1,
};
var barriers;


// базовый конструктор абстрактного модуля 
const makeUnit = function(coordX, coordY) {
    this.x = coordX;
    this.y = coordY;
    this.classes = [];
    this.unit = document.getElementsByClassName("cell-" + this.x + "-" + this.y)[0];
    this.draw = function() {
      for (var item in this.classes){
        this.unit.classList.add(this.classes[item]);
      }       
    }
     this.erase = function() {
      for (var item in this.classes){
        this.unit.classList.remove(this.classes[item]);
      }
    }
}

// конструктор модуля змейки
const makeSnakeUnit = function(coordX, coordY, setDirection) {
    makeUnit.call(this, coordX, coordY); // вызов родительского конструктора для данного объекта с прараметрами
    this.direction = setDirection;
    this.classes[0] = 'snake-unit';
    this.setTail = function() {
      this.unSetRounding();
      this.classes.push('snake-unit-tail');
      this.classes.push('snake-unit-direction-' + this.direction);
      this.draw();
    }
    this.setHead = function() {
      this.classes.push('snake-unit-head');
      this.classes.push('snake-unit-direction-' + this.direction);
      this.draw();
    }
    this.unSetHead = function() {
      for (var i = this.classes.length - 1; i >= 0; i-- ) {
        if ((this.classes[i] == 'snake-unit-head') || (~this.classes[i].indexOf('snake-unit-direction'))) {
          this.unit.classList.remove(this.classes[i]);
          this.classes.splice(i, 1);
        }        
      }     
    }
    this.setRounding = function(newDirection) {
      if (this.direction != newDirection){
        if ((this.direction == 'up' && newDirection == 'left') ||
            (this.direction == 'right' && newDirection == 'up') ||
            (this.direction == 'down' && newDirection == 'right') ||
            (this.direction == 'left' && newDirection == 'down')) {
              this.classes.push('snake-unit-turn-left');
        } else if (
            (this.direction == 'up' && newDirection == 'right') ||
            (this.direction == 'right' && newDirection == 'down') ||
            (this.direction == 'down' && newDirection == 'left') ||
            (this.direction == 'left' && newDirection == 'up')) {
              this.classes.push('snake-unit-turn-right');
        }
        this.classes.push('snake-unit-direction-' + this.direction);
        this.draw();
      }
    }
    this.unSetRounding = function() {
      for (var i = this.classes.length - 1; i >= 0; i-- ) {
        if ((~this.classes[i].indexOf('snake-unit-turn')) || (~this.classes[i].indexOf('snake-unit-direction'))) {
          this.unit.classList.remove(this.classes[i]);
          this.classes.splice(i, 1);
        }        
      }
    }
}
// задаем наследование,
makeSnakeUnit.prototype = Object.create(makeUnit.prototype); // теперь объект-прототип = объекту абстрактного модуля
makeSnakeUnit.prototype.constructor = makeSnakeUnit; //иначе это свойство будет ссылаться на makeUnit

// конструктор модуля еды
const makeFoodUnit = function(coordX, coordY) {
  makeUnit.call(this, coordX, coordY);
  this.classes[0] = 'food-unit';  
}
makeFoodUnit.prototype = Object.create(makeUnit.prototype);
makeFoodUnit.prototype.constructor = makeFoodUnit;

// конструктор модуля препятствий
const makeBarrierUnit = function(coordX, coordY) {
  makeUnit.call(this, coordX, coordY);
  this.classes[0] = 'barrier-unit'; 
}
makeBarrierUnit.prototype = Object.create(makeUnit.prototype);
makeBarrierUnit.prototype.constructor = makeBarrierUnit;

// конструктор собственно змейки
const makeSnake = function() {
  this.direction = 'up';
  var coordX = Math.floor(FIELD_SIZE_X / 2);
  var coordY = Math.floor(FIELD_SIZE_Y / 2);
  var snake_head = new makeSnakeUnit(coordX, coordY, this.direction);
  snake_head.setHead();
  var snake_tail = new makeSnakeUnit(coordX + 1, coordY, this.direction);
  snake_tail.setTail();
  this.push(snake_tail);
  this.push(snake_head); 
}
makeSnake.prototype = Object.create(Array.prototype);
makeSnake.prototype.constructor = makeSnake;

//var ssnake = new makeSnake(); 

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
    direction = "up";
    score = 0;
    //очистка классов ячеек (необходимо в случае перезапуска)
    flushCellClasses();
    document.getElementById("snake-field").classList.remove("show-alert");
    //snakeRender();
    snake = new makeSnake();
    document.getElementById("score-indic").innerHTML = score; // score = 0
    document.getElementById("btn-start-stop").innerHTML = "Закончить";
    gameStarted = true;
    snake_timer = setInterval(snakeMove, SNAKE_SPEED);
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
  document.getElementById("btn-start-stop").innerHTML = "Начать";
}
/*
function snakeRender() {
  var coord_x = Math.floor(FIELD_SIZE_X / 2);
  var coord_y = Math.floor(FIELD_SIZE_Y / 2);
  var snake_head = new makeSnakeUnit(coord_x, coord_y);
  //snake_head.draw();
  snake_head.setHead();
  var snake_tail = new makeSnakeUnit(coord_x + 1, coord_y);
  //snake_tail.draw();
  snake_tail.setTail();
  snake.push(snake_tail);
  snake.push(snake_head);
}
*/

function snakeMove() {
  var coord_x = snake[snake.length - 1].x;
  var coord_y = snake[snake.length - 1].y;

  switch (snake.direction) {
    case "up":
      coord_x--;
      if (coord_x < 0) {
        coord_x += FIELD_SIZE_X;
      }
      break;
    case "down":
      coord_x++;
      if (coord_x >= FIELD_SIZE_X) {
        coord_x -= FIELD_SIZE_X;
      }
      break;
    case "left":
      coord_y--;
      if (coord_y < 0) {
        coord_y += FIELD_SIZE_Y;
      }
      break;
    case "right":
      coord_y++;
      if (coord_y >= FIELD_SIZE_Y) {
        coord_y -= FIELD_SIZE_Y;
      }
  }

  if (!isSnakeXY(coord_x, coord_y) && !isBarrierXY(coord_x, coord_y)) {
    var new_unit = new makeSnakeUnit(coord_x, coord_y, snake.direction);
    new_unit.draw();
    new_unit.setHead();
    snake[snake.length - 1].unSetHead();
    snake[snake.length - 1].setRounding(new_unit.direction);
    snake.push(new_unit); 
    
    if (!ateFood(new_unit)) {
      var tail_remove = snake.splice(0, 1)[0];
      tail_remove.erase();
      snake[0].direction = snake[1].direction;
      snake[0].setTail();
    }    

  } else {
    document.getElementById("snake-field").classList.add("show-alert");
    finishGame();
  }  
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
