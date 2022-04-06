const square_div = document.querySelector(".square");
const restart_btns = document.querySelectorAll(".restart-btn");
const gameOverMenu_div = document.querySelector(".game-over-menu");
const score_spans = document.querySelectorAll(".score");
const maxScore_span = document.querySelector(".max-score");

const squareArr = [];
let gameStart = false;
let snake = [];
snake.push(Math.floor(Math.random() * 400));
let directionTemp = "n";
let gameDirection = "n";
let food;

function setMaxScoreInLS(score) {
  window.localStorage.setItem("maxScore", `${score}`);
}

function getMaxScore() {
  return window.localStorage.getItem("maxScore");
}

for (let i = 0; i < 400; i++) {
  const squareElem_div = document.createElement("div");
  squareElem_div.classList.add(`square-elem`);
  squareElem_div.classList.add(`_${i}`);
  squareElem_div.id = i;

  square_div.appendChild(squareElem_div);
  squareArr.push(squareElem_div);
}
const gameRunning = setInterval(() => {
  if (!gameStart) return;
  gameDirection = directionTemp;
  moveSnake();
}, 150);

function restart() {
  gameOverMenu_div.classList.remove("game-over-active");

  gameStart = false;
  directionTemp = "n";
  gameDirection = "n";

  snake = [];
  snake.push(Math.floor(Math.random() * 400));

  dropFood();
  refresh();
  score_spans.forEach((elem) => (elem.textContent = snake.length - 1));
}
restart();

function dropFood() {
  if (food || food === 0) {
    squareArr[food].classList.remove("isFood");
  }
  let num;
  do {
    num = Math.floor(Math.random() * 400);
  } while (snake.includes(num));

  food = num;
}

function refresh() {
  squareArr.forEach((elem) => {
    if (snake.includes(Number(elem.id)) && snake[0] === Number(elem.id)) {
      elem.classList.add("isSnakeHead");
    } else if (snake.includes(Number(elem.id))) {
      elem.classList.remove("isSnakeHead");

      elem.classList.add("isSnake");
    } else {
      elem.classList.remove("isSnake");
      elem.classList.remove("isSnakeHead");
    }
  });
  squareArr[food].classList.add("isFood");
}

function checkGameOver(head) {
  const copyArr = snake.slice(1);
  return copyArr.find((elem) => elem === head);
}

function gameOver() {
  gameStart = false;
  gameOverMenu_div.classList.add("game-over-active");
  score_spans.forEach((elem) => (elem.textContent = snake.length - 1));
  if (snake.length - 1 > Number(getMaxScore()) || getMaxScore() === "") {
    setMaxScoreInLS(`${snake.length - 1}`);
  }
  maxScore_span.textContent = Number(getMaxScore())
}

function checkAte() {
  if (snake[0] === food) {
    dropFood();
    //add body
    snake.push(snake[length - 1] - 1);
    score_spans.forEach((elem) => (elem.textContent = snake.length - 1));
  }
}

function moveSnake() {
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = snake[i - 1];
  }

  switch (gameDirection) {
    case "s":
      if (Math.floor(snake[0] / 20) !== Math.floor((snake[0] - 1) / 20))
        snake[0] += 19;
      else snake[0]--;
      break;
    case "u":
      if (snake[0] - 20 < 0) snake[0] += 380;
      else snake[0] -= 20;
      break;
    case "r":
      if (Math.floor(snake[0] / 20) !== Math.floor((snake[0] + 1) / 20))
        snake[0] -= 19;
      else snake[0]++;
      break;
    case "d":
      if (snake[0] + 20 > 399) snake[0] -= 380;
      else snake[0] += 20;
      break;
  }

  if (checkGameOver(snake[0])) {
    gameOver();
    return;
  }
  checkAte();
  refresh();
}

function changeDirectionTemp(e) {
  if (e.keyCode < 37 || e.keyCode > 40) return;

  //if opposite
  if (e.keyCode === 37 && gameDirection === "r") return;
  if (e.keyCode === 39 && gameDirection === "s") return;
  if (e.keyCode === 38 && gameDirection === "d") return;
  if (e.keyCode === 40 && gameDirection === "u") return;
  //if equal
  if (e.keyCode === 37 && gameDirection === "s") return;
  if (e.keyCode === 38 && gameDirection === "u") return;
  if (e.keyCode === 39 && gameDirection === "r") return;
  if (e.keyCode === 40 && gameDirection === "d") return;

  switch (e.keyCode) {
    case 37:
      directionTemp = "s";
      break;
    case 38:
      directionTemp = "u";
      break;
    case 39:
      directionTemp = "r";
      break;
    case 40:
      directionTemp = "d";
      break;
  }

  if (!gameStart) {
    gameStart = true;
  }
}

function keyrestart(e) {
  if (e.keyCode !== 13) return;
  restart();
}

restart_btns.forEach((elem) => elem.addEventListener("click", restart));
document.addEventListener("keydown", changeDirectionTemp);
document.addEventListener("keydown", keyrestart);
