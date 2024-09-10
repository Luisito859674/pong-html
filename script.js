const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

let upPressed = false;
let downPressed = false;

// Define score thresholds for level increase
let level = 1;

const player = {
    x: 0,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#fff',
    dy: 5,
    score: 0
};

const computer = {
    x: canvas.width - paddleWidth,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#fff',
    dy: 4, // AI paddle speed will increase with level
    score: 0,
    reactionDelay: 0 // Delay for AI reaction
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 4, // Ball speed will increase with level
    dx: 4,
    dy: -4,
    color: '#fff'
};

function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = '32px Arial';
    context.fillText(text, x, y);
}

// Move the player's paddle
function movePaddle(paddle) {
    if (upPressed && paddle.y > 0) {
        paddle.y -= paddle.dy;
    } else if (downPressed && paddle.y < canvas.height - paddle.height) {
        paddle.y += paddle.dy;
    }
}

// Move the computer paddle with some random "mistakes"
function moveComputerPaddle() {
    computer.reactionDelay++;

    if (computer.reactionDelay > 5) {
        if (ball.y < computer.y + computer.height / 2) {
            computer.y -= computer.dy;
        } else if (ball.y > computer.y + computer.height / 2) {
            computer.y += computer.dy;
        }

        // Random mistakes added for the computer AI
        const missProbability = Math.random();
        if (missProbability < 0.05) {
            computer.y += 20;
        } else if (missProbability < 0.1) {
            computer.y -= 20;
        }

        computer.reactionDelay = 0;
    }

    // Ensure the computer paddle stays within the canvas
    if (computer.y < 0) {
        computer.y = 0;
    } else if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

// Move the ball and handle collisions
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Player scores if the ball passes the computer
    if (ball.x + ball.radius > canvas.width) {
        player.score++;
        checkLevelUp();  // Check if we need to level up
        resetBall();
    }

    // Computer scores if the ball passes the player
    if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
    }

    // Ball collision with player paddle
    if (ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height) {
        ball.dx *= -1;
    }

    // Ball collision with computer paddle
    if (ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height) {
        ball.dx *= -1;
    }
}

// Reset the ball to the center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
    ball.dy = ball.dy > 0 ? ball.speed : -ball.speed;
}

// Check if the player has reached the next level based on their score
function checkLevelUp() {
    if (player.score === 5 || player.score === 10 || player.score === 15) {
        levelUp();
    }
}

// Increase the level and difficulty
function levelUp() {
    level++;
    computer.dy += 1;  // Increase computer paddle speed
    ball.speed += 1;    // Increase ball speed
    ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
    ball.dy = ball.dy > 0 ? ball.speed : -ball.speed;
    alert('Level up! You are now on level ' + level);
}

// Draw everything on the canvas
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    drawText(player.score, canvas.width / 4, canvas.height / 5, '#fff');
    drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5, '#fff');
    drawText('Level: ' + level, canvas.width / 2 - 40, canvas.height / 5, '#fff');
}

// Update the game state
function update() {
    movePaddle(player);
    moveComputerPaddle();
    moveBall();
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Manejar eventos de tecla presionada para el movimiento del paddle
document.addEventListener('keydown', (event) => {
    if (event.key === 'w') {
        upPressed = true;
    } else if (event.key === 's') {
        downPressed = true;
    }
});

// Manejar eventos de tecla soltada para el movimiento del paddle
document.addEventListener('keyup', (event) => {
    if (event.key === 'w') {
        upPressed = false;
    } else if (event.key === 's') {
        downPressed = false;
    }
});

// Start the game loop
gameLoop();
