const board_border = "black";
const snake_col = "lightblue";
const snake_border = "darkblue";

const snakeSpeed = document.getElementById("snakespeed");
const speedIncText = document.getElementById("speedincrement");

let snake = [
	{
		x: 200,
		y: 200,
	},
	{
		x: 190,
		y: 200,
	},
	{
		x: 180,
		y: 200,
	},
	{
		x: 170,
		y: 200,
	},
	{
		x: 160,
		y: 200,
	},
];

const DIFFICULTY_LEVEL = {
	EASY: 3,
	MEDIUM: 2,
	HARD: 1,
};

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let changing_direction = false;
let food_x;
let food_y;
let dx = 10;
let dy = 0;
let gameStarted = false;
let gamePaused = false;
let speed = 10;
let speedIncrement = 5;
let diffcultyLvl = DIFFICULTY_LEVEL.MEDIUM;

const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctx = snakeboard.getContext("2d");

document.addEventListener("keydown", (event) => {
	if (event.code === "Escape") {
		togglePauseGame();
	}
	change_direction(event);
});

function changeDifficultyLevel(value) {
	text = document.getElementById("difficulty-level");

	if (value == 1) {
		diffcultyLvl = DIFFICULTY_LEVEL.HARD;
		text.innerHTML = "MODE: hard";
		startGame();
	}
	if (value == 2) {
		diffcultyLvl = DIFFICULTY_LEVEL.MEDIUM;
		text.innerHTML = "MODE: medium";
		startGame();
	}
	if (value == 3) {
		diffcultyLvl = DIFFICULTY_LEVEL.EASY;
		text.innerHTML = "MODE: easy";
		startGame();
	}
}

function startGame() {
	gameStarted = true;
	document.getElementById("welcome-overlay").style.display = "none";
	document.getElementById("current-score").innerHTML = "Current Score: 0";
	document.getElementById("high-score").innerHTML = "High Score: " + highScore;
	score = 0;
	dx = 10;
	dy = 0;
	changing_direction = false;
	snake = [
		{
			x: 200,
			y: 200,
		},
		{
			x: 190,
			y: 200,
		},
		{
			x: 180,
			y: 200,
		},
		{
			x: 170,
			y: 200,
		},
		{
			x: 160,
			y: 200,
		},
	];
	gen_food();
	document.getElementById("score").innerHTML = score;
	main();
}

function togglePauseGame() {
	if (!gameStarted) return;
	gamePaused = !gamePaused;
	if (gamePaused) {
		document.getElementById("welcome-text").innerText = "Paused";
		document.getElementById("play-text").innerText = "Press Esc to Continue";
		document.getElementById("welcome-overlay").style.display = "flex";
	} else {
		document.getElementById("welcome-overlay").style.display = "none";
		main();
	}
}

function increaseSpeed() {
	// increase snake speed upon hitting food
	speed += speedIncrement / diffcultyLvl;
	if (speedIncrement < 11) {
		speedIncrement += score / 10;
	}
	snakeSpeed.innerHTML = "SPEED: " + speed.toString();
	speedIncText.innerHTML = "Increment: " + speedIncrement.toString();
}

function main() {
	if (has_game_ended() || gamePaused) {
		showGameOver();
		return;
	}
	changing_direction = false;
	setTimeout(function onTick() {
		clear_board();
		drawFood();
		move_snake();
		drawSnake();
		main();
	}, 100 - speed);
}

function clear_board() {
	snakeboard_ctx.fillStyle = "white";
	snakeboard_ctx.strokestyle = board_border;
	snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
	snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function drawSnake() {
	snake.forEach(drawSnakePart);
}

function drawFood() {
	snakeboard_ctx.fillStyle = "lightgreen";
	snakeboard_ctx.strokestyle = "darkgreen";
	snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
	snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

function drawSnakePart(snakePart) {
	snakeboard_ctx.fillStyle = snake_col;
	snakeboard_ctx.strokestyle = snake_border;
	snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
	snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function has_game_ended() {
	// self collision check
	for (let i = 4; i < snake.length; i++) {
		if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
	}

	// wall collision check
	if (snake[0].x == snakeboard.width) {
		return true;
	}
	if (snake[0].x == -10) {
		return true;
	}

	if (snake[0].y == snakeboard.height) {
		return true;
	}

	if (snake[0].y == -10) {
		return true;
	}

	return false;
}

function random_food(min, max) {
	return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function gen_food() {
	food_x = random_food(0, snakeboard.width - 10);
	food_y = random_food(0, snakeboard.height - 10);
	snake.forEach(function has_snake_eaten_food(part) {
		const has_eaten = part.x === food_x && part.y === food_y;
		if (has_eaten) gen_food();
	});
}

function change_direction(event) {
	const LEFT_KEY = 37;
	const RIGHT_KEY = 39;
	const UP_KEY = 38;
	const DOWN_KEY = 40;

	if (!gameStarted || gamePaused) return;

	if (changing_direction) return;
	changing_direction = true;
	const keyPressed = event.keyCode;
	const goingUp = dy === -10;
	const goingDown = dy === 10;
	const goingRight = dx === 10;
	const goingLeft = dx === -10;
	if (keyPressed === LEFT_KEY && !goingRight) {
		dx = -10;
		dy = 0;
	}
	if (keyPressed === UP_KEY && !goingDown) {
		dx = 0;
		dy = -10;
	}
	if (keyPressed === RIGHT_KEY && !goingLeft) {
		dx = 10;
		dy = 0;
	}
	if (keyPressed === DOWN_KEY && !goingUp) {
		dx = 0;
		dy = 10;
	}
}

function move_snake() {
	const head = {
		x: snake[0].x + dx,
		y: snake[0].y + dy,
	};
	snake.unshift(head);
	const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
	if (has_eaten_food) {
		score += 10;
		increaseSpeed();
		document.getElementById("score").innerHTML = score;
		document.getElementById("current-score").innerHTML =
			"Current Score: " + score;
		if (score > highScore) {
			highScore = score;
			localStorage.setItem("highScore", highScore);
			document.getElementById("high-score").innerHTML =
				"High Score: " + highScore;
		}
		gen_food();
	} else {
		snake.pop();
	}

	// Move the snake to the opposite side if it crosses the boarders

	// if (snake[0].x >= snakeboard.width) snake[0].x = 0;
	// else if (snake[0].x < 0) snake[0].x = snakeboard.width - 10;
	// if (snake[0].y >= snakeboard.height) snake[0].y = 0;
	// else if (snake[0].y < 0) snake[0].y = snakeboard.height - 10;
}

function restartGame() {
	gameStarted = false;
	gamePaused = false;
	document.getElementById("welcome-text").innerText = "Welcome to Snake";
	document.getElementById("game-over").style.display = "none";
	startGame();
}

function showGameOver() {
	document.getElementById("game-over").style.display = "block";
	document.getElementById("final-score").innerHTML = score;
	const highScore = localStorage.getItem("highScore") || 0;
	document.getElementById("high-score").innerHTML = "High Score: " + highScore;
}
