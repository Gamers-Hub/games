/*
* Name : Breakout 2D
* URI : https://gamershub.in/breakout-2d
*/


// get the canvas container
let canvas = document.getElementById('gameContainer');

// store the 2d rendering context
let ctx = canvas.getContext('2d');

// score
let score = 0;

// lives (chances)
let lives = 3;

// cordinates
let x = canvas.width / 2;
let y = canvas.height - 30;

// shift / motion speed
let dx = 6;
let dy = -2;

// bricks
let brickRowCount = 3; // Number of rows to show bricks
let brickColumnCount = 5; // Number of columns to show bricks
let brickWidth = 75; // width of brick
let brickHeight = 20; // height of brick
let brickGap = 10; // gap between bricks
let brickOffsetTop = 30; // offset from top of canvas
let brickOffsetLeft = 30; // offset from left of canvas

// two dimensional array to display bricks
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }; // positions of bricks (x,y, status_of_visibility)
  }
}

// ball
let ballRadius = 10;

// paddle
let paddleHeight = 10;
let paddleWidth = 75;

// paddle x-axis position
let paddleX = (canvas.width - paddleWidth) / 2;
// paddle y-axis position
let paddleY = canvas.height - paddleHeight;

// control (left key and right key)
let rightPressed = false;
let leftPressed = false;

// create bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      // show the bricks if the ball was not hit
      if (bricks[c][r].status == 1) {
        // defining the position of individual bricks
        let brickX = c * (brickWidth + brickGap) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickGap) + brickOffsetTop;

        bricks[c][r].x = brickX; // set brick x cordinate
        bricks[c][r].y = brickY; // set brick y cordinate

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#111';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// create ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#111';
  ctx.fill();
  ctx.closePath();
}

// create paddle
function drawPaddle() {
  // check if right key is pressed
  if (rightPressed) {
    paddleX += 7;
    // if paddle width is greater than canvas width (in right direction -x )
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
    // if paddle width is greater than canva
  }
  if (leftPressed) {
    paddleX -= 7;
    // if paddle goes left of 0 x-axis, set paddle x to 0
    if (paddleX < 0) {
      paddleX = 0;
    }
  }

  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight); // x,y, width, height
  ctx.fillStyle = '#111';
  ctx.fill();
  ctx.closePath();
}

// game container
function draw() {
  // clear canvas content
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // create the bricks
  drawBricks();

  // create the ball
  drawBall();

  // create the paddle
  drawPaddle();

  // display score
  drawScore();

  //display lives
  drawLives();

  // collide with bricks
  collisionDetection();

  // ball and paddle collision detection
  // reverse the direction if hit top
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    // if ball hits the paddle , collide and reverse ball direction
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      // if ball hits the bottom - Game Over !!

      // decrease lives on paddle miss
      lives--;

      // if no lives game over
      if (!lives) {
        alert('Game Over !');
        document.location.reload();
      } else {
        alert('Missed ! Remaining Lives :' + lives);
        // if lives remaining, then reset the ball position
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 5;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // reverse the direction if hit  left or right wall
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  // increment position of ball
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

// check if user pressed any control (left or right key)
function keyDownHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = true;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = true;
  }
}
document.addEventListener('keydown', keyDownHandler, false);

// check if user released any control (left or right key)
function keyUpHandler(e) {
  console.log(e.key);
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = false;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = false;
  }
}
document.addEventListener('keyup', keyUpHandler, false);

// check for mouse movement and update position of paddle
function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft; // horizontal mouse position of viewport

  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
document.addEventListener('mousemove', mouseMoveHandler, false);

// brick ball collision detection
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r]; //individual brick

      // if brick is not destroyed yet
      if (b.status == 1) {
        // if x position of ball is greater than x position of brick (collide brick)
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          // reverse direction
          dy = -dy;

          // destroy brick
          b.status = 0;

          // increment score
          score++;

          // if all bricks are destroyed
          if (score == brickRowCount * brickColumnCount) {
            alert('You Win , Congratulations !');
            document.location.reload();
          }
        }
      }
    }
  }
}

// show score
function drawScore() {
  // score text
  ctx.font = '16px Arial';
  ctx.fillStyle = '#111';
  ctx.fillText('Score: ' + score, 8, 20); // text, x-axis position, y-axis position
}

// show lives
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#111';
  ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

draw();

//var interval = setInterval(draw, 10);
